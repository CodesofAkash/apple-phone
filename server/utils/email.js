import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendResetOtpEmail(email, otp) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // use this until you verify a domain
      to: email,
      subject: 'Your Password Reset OTP',
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP expires in 10 minutes.</p>
      `
    })
    console.log('✅ Email sent to:', email, "OTP:", otp)
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    throw new Error('Failed to send OTP email: ' + error.message)
  }
}