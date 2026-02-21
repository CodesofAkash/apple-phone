import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import emailjs from '@emailjs/browser'

const ContactPage = () => {
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  useGSAP(() => {
    // Hero animations
    gsap.to('#contact-title', { 
      opacity: 1, 
      y: 0, 
      duration: 1.2, 
      delay: 0.3,
      ease: 'power2.out'
    })
    
    gsap.to('#contact-subtitle', { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      delay: 0.6,
      ease: 'power2.out'
    })

    // Form container animation
    gsap.to('#contact-form', { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      delay: 0.8,
      ease: 'power2.out'
    })

    // Form fields stagger animation
    gsap.to('.form-field', { 
      opacity: 1, 
      y: 0, 
      stagger: 0.15, 
      duration: 0.8, 
      delay: 0.9,
      ease: 'power2.out'
    })

    // Contact info cards animation
    gsap.to('.contact-card', { 
      opacity: 1, 
      scale: 1,
      stagger: 0.2, 
      duration: 0.8, 
      delay: 1.2,
      ease: 'back.out(1.4)'
    })

    // Floating animation for decorative elements
    gsap.to('.float-elem', {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.3
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    setSuccess(false)

    const serviceId = 'service_3c7v5lp'
    const templateId = 'template_ztku1ka'
    const publicKey = '3-eFGhotqAWABe54T'

    emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)
      .then(
        () => {
          setSuccess(true)
          setLoading(false)
          formRef.current.reset()
          
          setTimeout(() => {
            setSuccess(false)
          }, 5000)
        },
        (error) => {
          setError(true)
          setLoading(false)
          console.error('EmailJS Error:', error)
        }
      )
  }

  return (
    <section className="w-screen min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="float-elem absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="float-elem absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="float-elem absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-[50vh] flex items-center justify-center px-5 pt-20">
          <div className="text-center max-w-4xl">
            <h1 
              id="contact-title" 
              className="text-6xl md:text-8xl font-bold opacity-0 translate-y-10 mb-6"
            >
              Let's Connect
            </h1>
            <p 
              id="contact-subtitle"
              className="text-xl md:text-2xl text-gray-400 opacity-0 translate-y-10 max-w-2xl mx-auto"
            >
              If you have some queries, use the form below to contact me
            </p>
          </div>
        </div>

        <div className="screen-max-width pb-20">
          <div className="px-5">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <div className="order-2 lg:order-1">
                <form 
                  id="contact-form"
                  ref={formRef} 
                  onSubmit={handleSubmit} 
                  className="bg-zinc-900/50 backdrop-blur-xl border-2 border-zinc-700 rounded-3xl p-8 space-y-6 opacity-0 translate-y-10"
                >
                    {/* Name Field */}
                    <div className="form-field opacity-0 translate-y-10 group">
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-200 mb-3 group-focus-within:text-blue-400 transition-colors">
                        Your Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="from_name"
                          required
                          className="w-full pl-12 pr-6 py-4 bg-black/30 border border-zinc-700/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-white placeholder-gray-500"
                          placeholder="Akash Sharma"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="form-field opacity-0 translate-y-10 group">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-3 group-focus-within:text-purple-400 transition-colors">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="from_email"
                          required
                          className="w-full pl-12 pr-6 py-4 bg-black/30 border border-zinc-700/50 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all text-white placeholder-gray-500"
                          placeholder="akash@example.com"
                        />
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div className="form-field opacity-0 translate-y-10 group">
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-200 mb-3 group-focus-within:text-pink-400 transition-colors">
                        Subject
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-500 group-focus-within:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          className="w-full pl-12 pr-6 py-4 bg-black/30 border border-zinc-700/50 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all text-white placeholder-gray-500"
                          placeholder="Topic"
                        />
                      </div>
                    </div>

                    {/* Message Field */}
                    <div className="form-field opacity-0 translate-y-10 group">
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-200 mb-3 group-focus-within:text-blue-400 transition-colors">
                        Your Message
                      </label>
                      <div className="relative">
                        <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          className="w-full pl-12 pr-6 py-4 bg-black/30 border border-zinc-700/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-white placeholder-gray-500 resize-none"
                          placeholder="Tell me about your issues..."
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-field opacity-0 translate-y-10">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full overflow-hidden bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-5 px-8 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <div className="absolute inset-0 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                        <span className="relative flex items-center justify-center gap-3">
                          {loading ? (
                            <>
                              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span className="text-lg">Sending...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg">Send Message</span>
                              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </>
                          )}
                        </span>
                      </button>
                    </div>

                    {/* Success Message */}
                    {success && (
                      <div 
                        id="success-message"
                        className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-green-400 font-bold text-lg">Success!</p>
                            <p className="text-green-300/80 text-sm">Message sent successfully. I'll get back to you soon!</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <div 
                        id="error-message"
                        className="p-6 bg-gradient-to-r from-red-500/20 to-rose-500/20 border-2 border-red-500/50 rounded-2xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-red-400 font-bold text-lg">Oops!</p>
                            <p className="text-red-300/80 text-sm">Something went wrong. Please try again or email me directly.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
              </div>

              {/* Contact Info Cards */}
              <div className="order-1 lg:order-2 space-y-6">
                {/* Email Card */}
                <div className="contact-card opacity-0 scale-95 bg-linear-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-3xl p-8 hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-all">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Email</h3>
                      <p className="text-gray-200">akashcodesharma@gmail.com</p>
                      <p className="text-sm text-gray-400 mt-2">I'll respond within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="contact-card opacity-0 scale-95 bg-linear-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-3xl p-8 hover:border-purple-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-all">
                      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Location</h3>
                      <p className="text-gray-200">Jammu, Jammu & Kashmir</p>
                      <p className="text-sm text-gray-400 mt-2">India</p>
                    </div>
                  </div>
                </div>

                {/* Social Card */}
                <div className="contact-card opacity-0 scale-95 bg-linear-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-3xl p-8 hover:border-pink-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-pink-500/10 rounded-2xl group-hover:bg-pink-500/20 transition-all">
                      <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Social Media</h3>
                      <div className="flex gap-3 mt-3">
                        <a href="https://x.com/CodesOfAkash" target='_blank' className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                        <a href="https://github.com/CodesofAkash" target='_blank' className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/codesofakash/" target='_blank' className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time Card */}
                <div className="contact-card opacity-0 scale-95 bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8">
                  <div className="text-center">
                    <div className="text-5xl mb-4">⚡</div>
                    <h3 className="text-2xl font-bold mb-2">Quick Response</h3>
                    <p className="text-gray-200">
                      I typically respond within <span className="text-blue-400 font-bold">24 hours</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactPage