const nodemailer = require("nodemailer")

const sendEmail = async ({ email, subject, message }) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: message
    })

    console.log("Email sent:", email)

  } catch (err) {
    console.log("Email Error:", err.message)
  }
}

module.exports = sendEmail