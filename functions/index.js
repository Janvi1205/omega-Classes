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

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: config.email.smtpHost,
  port: config.email.smtpPort,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.senderEmail,
    pass: config.email.appPassword
  },
  tls: {
    rejectUnauthorized: false
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
    
    // Log configuration for debugging
    logger.info("Email configuration:", {
      senderEmail: config.email.senderEmail,
      teacherEmail: config.email.teacherEmail,
      hasAppPassword: !!config.email.appPassword
    });
    
    // Validate required fields
    if (!studentData.name || !studentData.email || !studentData.phone) {
      logger.error("Missing required fields:", studentData);
      return res.status(400).json({ 
        error: "Missing required fields: name, email, and phone are required" 
      });
    }

    // Validate email configuration
    if (!config.email.appPassword) {
      logger.error("Email app password is not configured");
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
    const response = await transporter.sendMail(mailOptions);
    
    logger.info("Student registration email sent successfully:", {
      studentName: studentData.name,
      studentEmail: studentData.email,
      teacherEmail: teacherEmail,
      messageId: response.messageId
    });

    // Store registration data in Firestore for record keeping
    try {
      const db = admin.firestore();
      await db.collection(config.firebase.collections.studentRegistrations).add({
        ...studentData,
        registrationTime: admin.firestore.FieldValue.serverTimestamp(),
        emailSent: true,
        emailMessageId: response.messageId
      });
      logger.info("Student registration stored in Firestore");
    } catch (firestoreError) {
      logger.warn("Failed to store in Firestore, but email was sent:", firestoreError);
    }

    res.status(200).json({ 
      success: true, 
      message: "Registration email sent successfully",
      messageId: response.messageId
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


