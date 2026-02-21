import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

const AboutPage = () => {

  useGSAP(() => {
    // Hero section animations
    gsap.to('#about-title', { 
      opacity: 1, 
      y: 0, 
      duration: 1.2, 
      delay: 0.3,
      ease: 'power2.out'
    })
    
    gsap.to('#about-subtitle', { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      delay: 0.6,
      ease: 'power2.out'
    })

    // Profile image animation
    gsap.to('#profile-image', { 
      opacity: 1, 
      scale: 1,
      rotation: 0,
      duration: 1.2, 
      delay: 0.9,
      ease: 'back.out(1.4)'
    })


    // Journey timeline animation with ScrollTrigger
    gsap.to('.journey-item', {
      opacity: 1,
      x: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.journey-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // Stats counter animation
    document.querySelectorAll('.stat-number').forEach(element => {
      const targetValue = parseInt(element.getAttribute('data-value')) || 0
      gsap.to(element, {
        textContent: targetValue,
        duration: 2,
        ease: 'power1.inOut',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        }
      })
    })

    // Tech stack icons animation
    gsap.to('.tech-icon', {
      opacity: 1,
      scale: 1,
      rotation: 360,
      stagger: 0.08,
      duration: 0.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.tech-section',
        start: 'top 80%',
      }
    })

    // Parallax effect for background elements
    gsap.to('.parallax-slow', {
      y: 100,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5
      }
    })

    gsap.to('.parallax-fast', {
      y: -100,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5
      }
    })

    // Floating animation for decorative elements
    gsap.to('.float-slow', {
      y: -30,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })

    gsap.to('.float-fast', {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
  }, [])

  const journey = [
    { year: '2020', title: 'Started Coding', description: 'Fell in love with web development' },
    { year: '2021', title: 'First Projects', description: 'Built my first real-world applications' },
    { year: '2022', title: 'Mastered React', description: 'Deep dive into modern React ecosystem' },
    { year: '2023', title: 'Advanced Animations', description: 'Learned GSAP and Three.js' },
    { year: '2024', title: 'Full Stack', description: 'Expanded to backend development' },
    { year: '2025', title: 'Current', description: 'Building amazing web experiences' }
  ]

  const techStack = [
    '⚛️', '📱', '🎨', '🎬', '🎮', '🔥', '⚡', '🚀', 
    '💾', '🔧', '🎯', '✨', '🌟', '💡', '🎪', '🎭'
  ]

  return (
    <section className="w-screen min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="parallax-slow float-slow absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="parallax-fast float-fast absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="parallax-slow absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center px-5 pt-20">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 
                id="about-title" 
                className="text-6xl md:text-8xl font-bold opacity-0 translate-y-10 mb-6"
              >
                About Me
              </h1>
              <p 
                id="about-subtitle"
                className="text-xl md:text-2xl text-gray-400 opacity-0 translate-y-10 mb-8 leading-relaxed"
              >
                I'm a passionate <span className="text-blue-400 font-semibold">lerner</span> who is always ready to learn new things, specializing in web dev - creating stunning web experiences with modern technologies. 
                I love bringing designs to life with smooth animations and interactive 3D elements.
              </p>
              <div className="flex flex-wrap gap-4 opacity-0 translate-y-10" id="about-subtitle">
                <div className="px-6 py-3 bg-linear-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full">
                  <span className="text-blue-400 font-semibold">Student</span>
                </div>
                <div className="px-6 py-3 bg-linear-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full">
                  <span className="text-purple-400 font-semibold">Web Developer</span>
                </div>
                <div className="px-6 py-3 bg-linear-to-r from-pink-600/20 to-red-600/20 border border-pink-500/30 rounded-full">
                  <span className="text-pink-400 font-semibold">Aspiring Software Engineer</span>
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center lg:justify-end">
              <div 
                id="profile-image"
                className="opacity-0 scale-75 rotate-12 relative"
              >
                <div className="w-80 h-80 bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-9xl">
                    👨‍💻
                  </div>
                  {/* Animated border */}
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="screen-max-width py-20 px-5">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
            <h2 className="text-5xl font-bold mb-6">Let's Work Together</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              I'm always interested in hearing about new projects and opportunities. Let's create something amazing!
            </p>
            <a 
              href="/contact"
              className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Get In Touch →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage