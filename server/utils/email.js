import nodemailer from 'nodemailer'

const buildTransporter = () => {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (!user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  })
}

export const sendResetOtpEmail = async ({ to, otp, name }) => {
  const transporter = buildTransporter()

  if (!transporter) {
    console.error('❌ EMAIL NOT CONFIGURED - Cannot send OTP email')
    console.error('Missing environment variables: EMAIL_USER and/or EMAIL_PASS')
    console.error('Please add these to your .env file:')
    console.error('  EMAIL_USER=your-gmail@gmail.com')
    console.error('  EMAIL_PASS=your-app-password')
    console.error('')
    console.error('📧 For development, the OTP is:', otp)
    throw new Error('Email service not configured')
  }

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER
  const displayName = name ? `Hi ${name},` : 'Hi,'

  try {
    console.log('📧 Sending OTP email to:', to)
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Your password reset code',
      text: `${displayName}\n\nYour OTP is ${otp}. It expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>${displayName}</p>
          <p>Your verification code is:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 8px;">${otp}</h1>
          </div>
          <p style="color: #6b7280;">This code will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #6b7280;">If you did not request this password reset, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `
    })
    console.log('✅ Email sent successfully! Message ID:', info.messageId)
  } catch (error) {
    console.error('❌ Failed to send email:', error.message)
    console.error('Full error:', error)
    throw new Error('Failed to send OTP email: ' + error.message)
  }
}
