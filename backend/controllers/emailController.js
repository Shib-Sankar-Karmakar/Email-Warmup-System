// const nodemailer = require('nodemailer');
// const Email = require('../models/email').Email;

// const sendEmail = async (req, res) => {
//   const { host, port, email, appPassword, fromName, fromEmail, to, subject, emailBody } = req.body;

//   const mailTransporter = nodemailer.createTransport({
//     host: host || 'smtp.gmail.com',
//     port: port || 465,
//     secure: true,
//     auth: {
//       user: email,
//       pass: appPassword,
//     },
//   });

//   const details = {
//     from: {
//       name: fromName,
//       address: fromEmail,
//     },
//     to: to,
//     subject: subject,
//     html: emailBody,
//   };

//   try {
//     await mailTransporter.sendMail(details);
//     const emailRecord = new Email({ fromName, fromEmail, to, subject, emailBody, status: 'sent' });
//     await emailRecord.save();
//     res.status(200).send('Email sent successfully');
//   } catch (err) {
//     console.log(err);
//     const emailRecord = new Email({ fromName, fromEmail, to, subject, emailBody, status: 'failed' });
//     await emailRecord.save();
//     res.status(500).send('Failed to send email');
//   }
// };

// module.exports = { sendEmail };


const nodemailer = require('nodemailer');
const Email = require('../models/email').Email;  // Assuming this is your MongoDB model for tracking emails

const sendEmail = async (req, res) => {
  const { host, port, email, appPassword, fromName, fromEmail, to, subject, emailBody } = req.body;

  // Create transport for sending the email
  const mailTransporter = nodemailer.createTransport({
    host: host || 'smtp.gmail.com',  // Default host if not provided
    port: port || 465,  // Default port for SSL (465) or you can use 587 for TLS
    secure: true,  // true for 465, false for other ports
    auth: {
      user: email,  // Your email address (sender)
      pass: appPassword,  // Your app-specific password
    },
  });

  // Email details to be sent
  const details = {
    from: {
      name: fromName,
      address: fromEmail,
    },
    to: to,
    subject: subject,
    html: emailBody,  // HTML content of the email
  };

  try {
    // Send email using nodemailer
    await mailTransporter.sendMail(details);
    
    // Save email record in MongoDB with status 'sent'
    const emailRecord = new Email({
      fromName,
      fromEmail,
      to,
      subject,
      emailBody,
      status: 'sent',
    });
    await emailRecord.save();  // Save to database

    // Send successful response
    res.status(200).send('Email sent successfully');
  } catch (err) {
    // Log the error to the console
    console.log('Error occurred while sending email:', err);

    // Save the email record with status 'failed'
    const emailRecord = new Email({
      fromName,
      fromEmail,
      to,
      subject,
      emailBody,
      status: 'failed',
    });
    await emailRecord.save();  // Save to database

    // Send failed response to frontend
    res.status(500).send('Failed to send email');
  }
};

module.exports = { sendEmail };
