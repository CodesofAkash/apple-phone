import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendResetOtpEmail(to, otp) {
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: [to],
    subject: 'Your Password Reset OTP',
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This expires in 10 minutes.</p>
    `
  })

  if (error) {
    console.error('❌ Resend error:', error)
    throw new Error('Failed to send OTP email: ' + error.message)
  }

  console.log('✅ Email sent:', data?.id)
}