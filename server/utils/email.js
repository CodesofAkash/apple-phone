import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
})

export async function sendResetOtpEmail(to, otp) {
  try {
    await transporter.sendMail({
      from: '"Apple Phone Store" <noreply@apple-phone.app>',
      to,
      subject: 'Your Password Reset OTP',
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This expires in 10 minutes.</p>
      `
    })
    console.log('✅ Email sent to:', to)
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    throw new Error('Failed to send OTP email: ' + error.message)
  }
}