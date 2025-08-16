// Configuration file for Firebase Functions
module.exports = {
  // Email Configuration
  email: {
    // Gmail SMTP settings
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    
    // Your Gmail address
    senderEmail: process.env.SENDER_EMAIL || "omegaproclasses@gmail.com",
    
    // App password (set via environment variable)
    appPassword: process.env.EMAIL_APP_PASSWORD,
    
    // Teacher's email address where registration notifications will be sent
    teacherEmail: process.env.TEACHER_EMAIL || "omegaproclasses@gmail.com",
    
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
