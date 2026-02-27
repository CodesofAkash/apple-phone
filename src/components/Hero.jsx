import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { heroVideo, smallHeroVideo } from '../utils'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  const [videoSrc, setVideoSrc] = useState(
    window.innerWidth < 760 ? smallHeroVideo : heroVideo
  )
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const newSrc = window.innerWidth < 760 ? smallHeroVideo : heroVideo
      if (newSrc !== videoSrc) {
        setVideoLoaded(false)
        setVideoSrc(newSrc)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [videoSrc])

  useGSAP(() => {
    gsap.to('#hero-title', { opacity: 1, ease: 'power1.in', delay: 1.5 })
    gsap.to('#cta', { opacity: 1, y: -50, delay: 2, ease: 'power1.in' })
  }, [])

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero-title" className="hero-title">Apple phone 20 Pro</p>

        <div className="md:w-10/12 w-9/12 relative">
          {/* Skeleton shown until video can play */}
          {!videoLoaded && (
            <div className="absolute inset-0 flex-center bg-black z-10">
              <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            </div>
          )}

          <video
            autoPlay
            muted
            playsInline
            key={videoSrc}
            className={`pointer-events-none transition-opacity duration-700 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onCanPlay={() => setVideoLoaded(true)}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      <div id="cta" className="flex flex-col items-center opacity-0 translate-y-20">
        <button onClick={() => navigate('/products/apple-phone')} className="btn">
          Buy
        </button>
        <p className="font-normal text-xl">From ₹19999/month or ₹199999</p>
      </div>
    </section>
  )
}

export default Hero