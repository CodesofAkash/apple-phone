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

    // Skills animation
    gsap.to('.skill-card', { 
      opacity: 1, 
      y: 0,
      stagger: 0.1, 
      duration: 0.8, 
      delay: 1.2,
      ease: 'power2.out'
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

  const skills = [
    { name: 'React', level: 95, icon: '⚛️' },
    { name: 'GSAP', level: 90, icon: '🎬' },
    { name: 'Three.js', level: 85, icon: '🎮' },
    { name: 'Tailwind', level: 90, icon: '🎨' },
    { name: 'Node.js', level: 80, icon: '🟢' },
    { name: 'TypeScript', level: 85, icon: '📘' }
  ]

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
                I'm a passionate <span className="text-blue-400 font-semibold">full-stack developer</span> specializing in creating stunning web experiences with modern technologies. 
                I love bringing designs to life with smooth animations and interactive 3D elements.
              </p>
              <div className="flex flex-wrap gap-4 opacity-0 translate-y-10" id="about-subtitle">
                <div className="px-6 py-3 bg-linear-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full">
                  <span className="text-blue-400 font-semibold">Web Developer</span>
                </div>
                <div className="px-6 py-3 bg-linear-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full">
                  <span className="text-purple-400 font-semibold">UI/UX Enthusiast</span>
                </div>
                <div className="px-6 py-3 bg-linear-to-r from-pink-600/20 to-red-600/20 border border-pink-500/30 rounded-full">
                  <span className="text-pink-400 font-semibold">Animation Lover</span>
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

        {/* Skills Section */}
        <div className="screen-max-width py-20 px-5">
          <h2 className="text-5xl font-bold mb-16 text-center">
            My <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">Skills</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <div 
                key={index}
                className="skill-card opacity-0 translate-y-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{skill.icon}</span>
                  <h3 className="text-2xl font-bold">{skill.name}</h3>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-linear-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 group-hover:from-blue-400 group-hover:to-purple-400"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <p className="text-right text-gray-400 mt-2 text-sm">{skill.level}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section bg-linear-to-r from-blue-600/10 to-purple-600/10 py-20">
          <div className="screen-max-width px-5">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="stat-number text-6xl font-bold text-blue-400 mb-2" data-value="50">0</div>
                <p className="text-gray-400 text-lg">Projects Completed</p>
              </div>
              <div className="text-center">
                <div className="stat-number text-6xl font-bold text-purple-400 mb-2" data-value="5">0</div>
                <p className="text-gray-400 text-lg">Years Experience</p>
              </div>
              <div className="text-center">
                <div className="stat-number text-6xl font-bold text-pink-400 mb-2" data-value="100">0</div>
                <p className="text-gray-400 text-lg">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="stat-number text-6xl font-bold text-red-400 mb-2" data-value="25">0</div>
                <p className="text-gray-400 text-lg">Technologies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Section */}
        <div className="journey-section screen-max-width py-20 px-5">
          <h2 className="text-5xl font-bold mb-16 text-center">
            My <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">Journey</span>
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {journey.map((item, index) => (
              <div 
                key={index}
                className={`journey-item opacity-0 flex gap-8 items-start ${
                  index % 2 === 0 ? 'translate-x-[-100px]' : 'translate-x-[100px]'
                }`}
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-3xl font-bold text-blue-400">{item.year}</span>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mt-2 relative">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></div>
                </div>
                <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="tech-section screen-max-width py-20 px-5">
          <h2 className="text-5xl font-bold mb-16 text-center">
            Tech <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-red-400">Stack</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {techStack.map((icon, index) => (
              <div 
                key={index}
                className="tech-icon opacity-0 scale-0 w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-4xl hover:border-pink-500/50 hover:scale-110 transition-all cursor-pointer"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
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