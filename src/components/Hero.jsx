import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {heroVideo, smallHeroVideo} from '../utils';
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'

import { useCart } from '../context/CartContext'

const Hero = () => {

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)

  const handleVideoSrcSet = () => {
    if(window.innerWidth < '760px') {
      setVideoSrc(smallHeroVideo)
    } else {
      setVideoSrc(heroVideo)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleVideoSrcSet);

    return () => {
      window.removeEventListener('resize', handleVideoSrcSet);
    }
  }, [])


  useGSAP(() => {
    gsap.to('#hero-title', {
      opacity: 1,
      ease: 'power1.in',
      delay : 1.5
    })

    gsap.to('#cta', {
      opacity: 1,
      y: -50,
      delay: 2,
      ease: 'power1.in'
    })
  }, [])

  const handleClick = async () => {
    // let product

    // try {
    //   const response = await fetch(`${API_URL}/api/products/featured`)
    //   if (!response.ok) {
    //     throw new Error('No featured product available')
    //   }
    //   product = await response.json()
    // } catch (error) {
    //   alert(error.message || 'Failed to load product')
    //   return
    // }

    // const result = await addToCart(product, 1)
    
    // if (result.requiresAuth) {
    //   navigate('/signin')
    //   return
    // }

    // if (result.success) {
    //   navigate('/cart')
    // } else {
    //   alert('Failed to add to cart: ' + (result.error || 'Unknown error'))
    // }

    navigate('/product/iphone-15-pro')
  }

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero-title" className="hero-title">iPhone 15 Pro</p>
        <div className="md:w-10/12 w-9/12">
        <video autoPlay muted playsInline={true} key={videoSrc} className="pointer-events-none">
          <source src={videoSrc} type="video/mp4" />
        </video>
        </div>
      </div>

      <div id="cta" className="flex flex-col items-center opacity-0 translate-y-20">
        <button onClick={handleClick} className="btn">Buy</button>
        <p className="font-normal text-xl">From &199/month or $999</p>
      </div>
    </section>
  )
}

export default Hero


