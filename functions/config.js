// Configuration file for Firebase Functions
module.exports = {
  // Email Configuration
  email: {
    // Brevo API Key (Sendinblue)
    brevoApiKey: process.env.BREVO_API_KEY || "xsmtpsib-21182f1c2c60985a451d9d2a06f40effb920ce7d93541a7039cae9d1962e565b-DVkOz9sGbIfcx5KL",
    
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
