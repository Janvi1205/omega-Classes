// v5 CommonJS imports
const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");
require('dotenv').config();

// Load configuration
const config = require('./config');

admin.initializeApp();

// Optional: global options
setGlobalOptions({ region: "asia-south1" });

// Create Gmail transporter
const transporter = nodemailer.createTransport(config.email.smtp);

// Simple YouTube RSS/HTML proxy to return latest long-form videos
exports.youtubeLatest = onRequest(async (req, res) => {
  try {
    // CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    const channelId = req.query.channel_id || req.query.channelId;
    const max = Math.min(parseInt(req.query.max || '4', 10) || 4, 12);
    const minSeconds = parseInt(req.query.min_seconds || '120', 10) || 120; // default 2 minutes
    if (!channelId) {
      return res.status(400).json({ error: 'channel_id query param is required' });
    }

    function uploadsPlaylistId(cid) {
      // UCxxxxxxxx -> UUxxxxxxxx (uploads playlist)
      if (!cid || cid.length < 2) return undefined;
      return 'UU' + cid.substring(2);
    }

    function parseDurationText(t) {
      if (!t) return undefined;
      const parts = String(t).trim().split(':').map(n => parseInt(n, 10));
      if (parts.some(isNaN)) return undefined;
      if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
      if (parts.length === 2) return parts[0]*60 + parts[1];
      return parts[0];
    }

    async function fetchFromVideosTab(cid) {
      const url = `https://www.youtube.com/channel/${cid}/videos`;
      const resp = await fetch(url, { redirect: 'follow' });
      if (!resp.ok) throw new Error('videos tab fetch failed');
      const html = await resp.text();
      const m = html.match(/var ytInitialData = (\{[\s\S]*?\});/);
      if (!m) throw new Error('ytInitialData not found');
      const data = JSON.parse(m[1]);
      const tabs = data.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
      const videosTab = tabs.find(t => t.tabRenderer?.title === 'Videos')?.tabRenderer;
      const grid = videosTab?.content?.richGridRenderer || videosTab?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.gridRenderer;
      const items = (grid?.contents || grid?.items || []).map(x => x?.richItemRenderer?.content?.videoRenderer || x?.gridVideoRenderer).filter(Boolean);
      const vids = [];
      for (const it of items) {
        const vid = it.videoId;
        const title = it.title?.runs?.[0]?.text || it.title?.simpleText || 'Untitled';
        const timeText = it.lengthText?.simpleText || it.thumbnailOverlays?.find(o => o.thumbnailOverlayTimeStatusRenderer)?.thumbnailOverlayTimeStatusRenderer?.text?.simpleText;
        const dur = parseDurationText(timeText);
        // Accept only if duration parsed and >= minSeconds
        if (vid && typeof dur === 'number' && dur >= minSeconds) {
          vids.push({ id: vid, title, embedId: vid, duration: dur });
        }
        if (vids.length >= max) break;
      }
      return vids;
    }

    // First try the Videos tab (which excludes Shorts by UI), then fall back to uploads playlist RSS
    let videos = [];
    try {
      videos = await fetchFromVideosTab(channelId);
    } catch (e) {
      logger.warn('videos tab parse failed, falling back to RSS', e?.message || e);
    }

    if (videos.length < max) {
      const playlistId = uploadsPlaylistId(channelId);
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
      const resp = await fetch(rssUrl, { redirect: 'follow' });
      if (resp.ok) {
        const xml = await resp.text();
        const entryRegex = /<entry[\s\S]*?<\/entry>/g;
        const titleRegex = /<title>([^<]+)<\/title>/;
        const videoIdRegex = /<yt:videoId>([^<]+)<\/yt:videoId>/;
        const timeRegex = /<media:group>[\s\S]*?<yt:duration[^>]*seconds=\"(\d+)\"/;
        let match;
        while ((match = entryRegex.exec(xml)) !== null && videos.length < max) {
          const block = match[0];
          const title = (titleRegex.exec(block) || [])[1] || 'Untitled';
          const vid = (videoIdRegex.exec(block) || [])[1] || '';
          const d = (timeRegex.exec(block) || [])[1];
          const dur = d ? parseInt(d, 10) : undefined;
          if (vid && typeof dur === 'number' && dur >= minSeconds) {
            // ensure not duplicated
            if (!videos.find(v => v.id === vid)) videos.push({ id: vid, title, embedId: vid, duration: dur });
          }
        }
      }
    }

    const limited = videos.slice(0, max).map(v => ({ id: v.id, title: v.title, embedId: v.id }));
    return res.status(200).json({ channelId, count: limited.length, videos: limited });
  } catch (e) {
    logger.error('youtubeLatest error', e);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// HTTP function to send student registration email to teacher
exports.sendStudentEmail = onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const studentData = req.body;
    
    // Log the configuration for debugging
    logger.info("Email configuration:", {
      gmailUser: config.email.smtp.auth.user,
      teacherEmail: config.email.teacherEmail,
      senderEmail: config.email.senderEmail
    });
    
    // Validate required fields
    if (!studentData.name || !studentData.email || !studentData.phone) {
      logger.error("Missing required fields:", studentData);
      return res.status(400).json({ 
        error: "Missing required fields: name, email, and phone are required" 
      });
    }

    // Check if email configuration is available
    if (!config.email.smtp.auth.pass) {
      logger.error("Gmail app password is missing");
      return res.status(500).json({ 
        error: "Email configuration is missing" 
      });
    }

    // Get teacher email from configuration
    const teacherEmail = config.email.teacherEmail;
    
    // Create comprehensive email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Student Registration - ${config.app.name}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0;
          }
          .content { 
            background: #f9f9f9; 
            padding: 30px; 
            border-radius: 0 0 10px 10px;
          }
          .student-info { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0;
            border-left: 4px solid #667eea;
          }
          .field { 
            margin: 10px 0; 
            padding: 8px 0; 
            border-bottom: 1px solid #eee;
          }
          .field-label { 
            font-weight: bold; 
            color: #667eea; 
            display: inline-block; 
            width: 140px;
          }
          .field-value { 
            color: #333;
          }
          .timestamp { 
            text-align: center; 
            color: #666; 
            font-size: 14px; 
            margin-top: 20px;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding: 20px; 
            color: #666; 
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 New Student Registration</h1>
          <p>${config.app.name}</p>
        </div>
        
        <div class="content">
          <p>Hello Teacher,</p>
          
          <p>A new student has registered for your coaching classes. Here are the details:</p>
          
          <div class="student-info">
            <div class="field">
              <span class="field-label">Full Name:</span>
              <span class="field-value">${studentData.name}</span>
            </div>
            
            <div class="field">
              <span class="field-label">Email Address:</span>
              <span class="field-value">${studentData.email}</span>
            </div>
            
            <div class="field">
              <span class="field-label">Phone Number:</span>
              <span class="field-value">${studentData.phone}</span>
            </div>
            
            <div class="field">
              <span class="field-label">KV Student:</span>
              <span class="field-value">${studentData.isKVStudent === 'yes' ? 'Yes' : 'No'}</span>
            </div>
            
            <div class="field">
              <span class="field-label">Preferred Batch:</span>
              <span class="field-value">${studentData.preferredBatch}</span>
            </div>
            
            <div class="field">
              <span class="field-label">Selected Course:</span>
              <span class="field-value">${studentData.selectedCourse || 'Not specified'}</span>
            </div>
          </div>
          
          <p><strong>Action Required:</strong> Please contact the student within 24 hours to confirm their registration and provide further instructions.</p>
          
          <div class="timestamp">
            <strong>Registration Time:</strong> ${new Date().toLocaleString('en-IN', { 
              timeZone: config.app.timezone,
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from ${config.app.name}</p>
          <p>Please do not reply to this email</p>
        </div>
      </body>
      </html>
    `;

    // Create email object
    const mailOptions = {
      from: `"${config.email.senderName}" <${config.email.senderEmail}>`,
      to: teacherEmail,
      subject: `New Student Registration: ${studentData.name} - ${studentData.selectedCourse || 'General'}`,
      html: emailHtml
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    logger.info("Student registration email sent successfully:", {
      studentName: studentData.name,
      studentEmail: studentData.email,
      teacherEmail: teacherEmail,
      messageId: info.messageId
    });

    // Store registration data in Firestore for record keeping
    try {
      const db = admin.firestore();
      await db.collection(config.firebase.collections.studentRegistrations).add({
        ...studentData,
        registrationTime: admin.firestore.FieldValue.serverTimestamp(),
        emailSent: true,
        emailMessageId: info.messageId
      });
      logger.info("Student registration stored in Firestore");
    } catch (firestoreError) {
      logger.warn("Failed to store in Firestore, but email was sent:", firestoreError);
    }

    res.status(200).json({ 
      success: true, 
      message: "Registration email sent successfully",
      messageId: info.messageId
    });

  } catch (error) {
    logger.error("Error sending student registration email:", error);
    
    // Try to store failed registration attempt
    try {
      const db = admin.firestore();
      await db.collection(config.firebase.collections.studentRegistrations).add({
        ...req.body,
        registrationTime: admin.firestore.FieldValue.serverTimestamp(),
        emailSent: false,
        error: error.message
      });
    } catch (firestoreError) {
      logger.error("Failed to store failed registration:", firestoreError);
    }

    res.status(500).json({ 
      success: false, 
      error: "Failed to send registration email. Please try again later." 
    });
  }
});

// Test function to send a test email
exports.sendTestEmail = onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // Check if email configuration is available
    if (!config.email.smtp.auth.pass) {
      logger.error("Gmail app password is missing");
      return res.status(500).json({ 
        error: "Email configuration is missing. Please set GMAIL_APP_PASSWORD in .env file" 
      });
    }

    // Create test email template
    const testEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Email - ${config.app.name}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0;
          }
          .content { 
            background: #f9f9f9; 
            padding: 30px; 
            border-radius: 0 0 10px 10px;
          }
          .test-info { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0;
            border-left: 4px solid #28a745;
          }
          .timestamp { 
            text-align: center; 
            color: #666; 
            font-size: 14px; 
            margin-top: 20px;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding: 20px; 
            color: #666; 
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🧪 Test Email</h1>
          <p>${config.app.name}</p>
        </div>
        
        <div class="content">
          <p>Hello!</p>
          
          <p>This is a test email to verify that the Gmail SMTP configuration is working correctly.</p>
          
          <div class="test-info">
            <h3>✅ Email Configuration Test</h3>
            <p><strong>Status:</strong> Successfully sent via Gmail SMTP</p>
            <p><strong>Sender:</strong> ${config.email.senderEmail}</p>
            <p><strong>Recipient:</strong> janviyadav120505@gmail.com</p>
            <p><strong>Method:</strong> Nodemailer with Gmail SMTP</p>
          </div>
          
          <p>If you received this email, it means:</p>
          <ul>
            <li>✅ Gmail app password is correctly configured</li>
            <li>✅ SMTP settings are working</li>
            <li>✅ Email function is deployed successfully</li>
            <li>✅ Student registration emails will work properly</li>
          </ul>
          
          <div class="timestamp">
            <strong>Test Time:</strong> ${new Date().toLocaleString('en-IN', { 
              timeZone: config.app.timezone,
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
        
        <div class="footer">
          <p>This is a test email from ${config.app.name}</p>
          <p>Gmail SMTP Configuration Test</p>
        </div>
      </body>
      </html>
    `;

    // Create email object
    const mailOptions = {
      from: `"${config.email.senderName}" <${config.email.senderEmail}>`,
      to: "janviyadav120505@gmail.com",
      subject: `Test Email - Gmail SMTP Configuration - ${config.app.name}`,
      html: testEmailHtml
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    logger.info("Test email sent successfully:", {
      recipient: "janviyadav120505@gmail.com",
      messageId: info.messageId
    });

    res.status(200).json({ 
      success: true, 
      message: "Test email sent successfully to janviyadav120505@gmail.com",
      messageId: info.messageId
    });

  } catch (error) {
    logger.error("Error sending test email:", error);
    
    res.status(500).json({ 
      success: false, 
      error: "Failed to send test email. Please check your Gmail app password configuration.",
      details: error.message
    });
  }
});
