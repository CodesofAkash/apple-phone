import { memo, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const Loader = memo(() => {
  useGSAP(() => {
    // Animate logo
    gsap.to('.loader-logo', {
      scale: 1.1,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })

    // Animate dots
    gsap.to('.dot', {
      y: -10,
      stagger: 0.2,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })

    // Animate circle
    gsap.to('.loader-circle', {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: 'none'
    })

    // Glow animation
    gsap.to('.glow', {
      opacity: 0.3,
      scale: 1.2,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
  }, [])

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute inset-0"></div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Rotating circle with logo */}
        <div className="relative">
          <div className="loader-circle w-20 h-20 rounded-full border-4 border-transparent border-t-white opacity-90"></div>
          <div className="loader-logo absolute inset-0 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white" className="opacity-80">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
          </div>
        </div>

        {/* Loading text with dots */}
        <div className="flex items-center gap-2">
          <span className="text-white text-lg font-medium">Loading</span>
          <div className="flex gap-1">
            <div className="dot w-2 h-2 bg-white rounded-full"></div>
            <div className="dot w-2 h-2 bg-white rounded-full"></div>
            <div className="dot w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full animate-shimmer"
            style={{
              background: 'linear-gradient(to right, #3b82f6, #a855f7, #ec4899)',
              animation: 'shimmer 2s infinite',
              backgroundSize: '200% 100%',
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
})

Loader.displayName = 'Loader'

export default Loader