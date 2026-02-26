import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 2525,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
})

export async function sendResetOtpEmail(to, otp) {
  console.log('📧 Attempting email to:', to)
  console.log('📧 SMTP config:', {
    host: 'smtp-relay.brevo.com',
    port: 2525,
    user: process.env.BREVO_SMTP_LOGIN ? '✅ set' : '❌ missing',
    pass: process.env.BREVO_SMTP_KEY ? '✅ set' : '❌ missing',
  })

  try {
    const result = await transporter.sendMail({
      from: '"Apple Phone Store" <noreply@apple-phone.app>',
      to,
      subject: 'Your Password Reset OTP',
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This expires in 10 minutes.</p>
      `
    })
    console.log('✅ Email sent:', result.messageId)
  } catch (error) {
    console.error('❌ Email error code:', error.code)
    console.error('❌ Email error command:', error.command)
    console.error('❌ Full error:', error.message)
    throw new Error('Failed to send OTP email: ' + error.message)
  }
}