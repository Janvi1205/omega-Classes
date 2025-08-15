// Configuration file for Firebase Functions
module.exports = {
  // Email Configuration
  email: {
    // Brevo API Key (Sendinblue)
    brevoApiKey: process.env.BREVO_API_KEY || "",
    
    // Teacher's email address where registration notifications will be sent
    teacherEmail: process.env.TEACHER_EMAIL || "omegaproclasses@gmail.com",
    
    // Sender email address (should be verified in Brevo)
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
