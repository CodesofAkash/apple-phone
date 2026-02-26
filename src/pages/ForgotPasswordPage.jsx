import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { toast } from 'sonner'

const ForgotPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [sendingOtp, setSendingOtp] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    const emailFromQuery = searchParams.get('email') || ''
    if (emailFromQuery) {
      setFormData(prev => ({ ...prev, email: emailFromQuery }))
    }
  }, [searchParams])

  useGSAP(() => {
    gsap.from('#forgot-container', {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: 'power2.out'
    })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, label: '' }
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    const colors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-emerald-400']

    return { strength, label: labels[strength], color: colors[strength] }
  }


  const handleSendOtp = async () => {
    setError(null)
    setSuccess(null)

    if (!formData.email) {
      setError('Email is required')
      return
    }

    setSendingOtp(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.error || 'Failed to send OTP')
        return
      }

      if (data.emailSent) {
        setSuccess('OTP sent. Check your email.')
        toast.success('OTP sent to your email!')
      } else {
        // Email failed — show OTP in toast
        setSuccess('Email delivery unavailable. Your OTP is shown below.')
        toast('Your OTP', {
          description: `${data.otp}`,
          duration: 30000, // 30 seconds so they can copy it
          action: {
            label: 'Copy',
            onClick: () => {
              navigator.clipboard.writeText(data.otp)
              toast.success('OTP copied!')
            }
          }
        })
        // Also auto-fill the OTP field
        setFormData(prev => ({ ...prev, otp: data.otp }))
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const { strength } = passwordStrength(formData.newPassword)

    if (!formData.email || !formData.otp || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (strength < 5) {
      setError('Password must be very strong')
      return
    }

    setResetting(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data?.error || 'Failed to reset password')
        return
      }

      setSuccess('Password updated. You can sign in now.')
      setFormData(prev => ({ ...prev, otp: '', newPassword: '', confirmPassword: '' }))
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setResetting(false)
    }
  }

  const { strength, label, color } = passwordStrength(formData.newPassword)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div id="forgot-container" className="relative">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-20"></div>
          <div className="relative bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-10">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Reset Password</h1>
            <p className="text-gray-400 mb-8 text-center">Enter your email, OTP, and a new password.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-black/30 border border-zinc-700/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-white placeholder-gray-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">OTP</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className="flex-1 px-4 py-4 bg-black/30 border border-zinc-700/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-white placeholder-gray-500"
                    placeholder="Enter OTP"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingOtp ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-black/30 border border-zinc-700/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-white placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i < strength
                              ? 'bg-linear-to-r from-blue-500 to-purple-500'
                              : 'bg-zinc-700'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className={`text-xs ${color}`}>{label}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-black/30 border border-zinc-700/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-white placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={resetting || strength < 5}
                style={{ background: 'linear-gradient(to right, #2563eb, #9333ea, #ec4899)', minHeight: '56px' }}
                className="w-full text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {resetting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
