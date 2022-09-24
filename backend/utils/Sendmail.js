const nodeMailer = require('nodemailer')
// const { options } = require('../routes/ProductRoute')

const sendMail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // service: process.env.SMTP_SERVICE,
    auth: {
      user: [process.env.SMTP_MAIL],
      pass: [process.env.SMTP_PASSWORD],
    },
  })

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  // verify connection configuration
  transporter.verify(function (error, success, res) {
    if (error) {
      console.log('Send mail error: ' + error)
    } else {
      console.log('Server is ready to take our messages')
    }
  })

  const result = await transporter.sendMail(mailOptions)
}

module.exports = sendMail
