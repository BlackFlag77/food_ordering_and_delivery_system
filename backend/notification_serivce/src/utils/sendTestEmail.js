const nodemailer = require('nodemailer');

module.exports = async function sendTestEmail(to, subject, text) {
  // 1) Create a one-off Ethereal test SMTP account
  const testAccount = await nodemailer.createTestAccount();

  // 2) Create a transporter using the Ethereal SMTP details
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,   // generated ethereal user
      pass: testAccount.pass    // generated ethereal password
    }
  });

  // 3) Send the message
  const info = await transporter.sendMail({
    from: '"FoodiePortal" <no-reply@foodieportal.test>',
    to,            // e.g. 'you@yourdomain.com'
    subject,       // e.g. 'Your payment succeeded'
    text           // plain-text body
  });

  // 4) Log the preview URL so you can view it in your browser
  console.log('Preview your email at:', nodemailer.getTestMessageUrl(info));
  return info;
};
