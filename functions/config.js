// Configuration file for Firebase Functions
module.exports = {
  // Email Configuration
  email: {
    // Gmail SMTP Configuration
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER || "omegaproclasses@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD || "" // Gmail App Password
      }
    },
    
    // Teacher's email address where registration notifications will be sent
    teacherEmail: process.env.TEACHER_EMAIL || "janviyadav120505@gmail.com",
    
    // Sender email address (should be the same as Gmail user)
    senderEmail: process.env.SENDER_EMAIL || "omegaproclasses@gmail.com",
    
    // Sender name
    senderName: "Omega Pro Classes"
  },
  
  // Firebase Configuration
  firebase: {
    // Collection names
    collections: {
      studentRegistrations: 'studentRegistrations' // Used for storing registration data
    }
  },
  
  // Application Configuration
  app: {
    name: "Omega Pro Classes",
    timezone: "Asia/Kolkata"
  }
};
