import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { hightlightsSlides } from '../constants'
import { replayImg, playImg, pauseImg } from '../utils'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const VideoCarousel = () => {
  const videoRef = useRef([])
  const videoSpanRef = useRef([])
  const videoDivRef = useRef([])

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  })

  // Track which videos have loaded enough to play
  const [readyVideos, setReadyVideos] = useState({})

  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video

  useGSAP(() => {
    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut',
    })

    const ctx = gsap.context(() => {
      gsap.to('#video', {
        scrollTrigger: {
          trigger: '#video',
          toggleActions: 'restart none none none',
          onEnter: () =>
            setVideo((pre) => ({ ...pre, startPlay: true, isPlaying: true })),
        },
        onComplete: () =>
          setVideo((pre) => ({ ...pre, startPlay: true, isPlaying: true })),
      })
    })

    ScrollTrigger.refresh()
    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [isEnd, videoId])

  useEffect(() => {
    const currentVideo = videoRef.current[videoId]
    if (!currentVideo) return

    if (!isPlaying) {
      currentVideo.pause()
    } else if (startPlay) {
      currentVideo.play().catch((err) => console.log('Video play failed:', err))
    }
  }, [startPlay, videoId, isPlaying])

  useEffect(() => {
    let currentProgress = 0
    const span = videoSpanRef.current

    if (span[videoId]) {
      const anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100)
          if (progress !== currentProgress) {
            currentProgress = progress
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? '10vw'
                  : window.innerWidth < 1200
                  ? '10vw'
                  : '4vw',
            })
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: 'white',
            })
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], { width: '12px' })
            gsap.to(span[videoId], { backgroundColor: '#afafaf' })
          }
        },
      })

      if (videoId === 0) anim.restart()

      const animUpdate = () => {
        const currentVideo = videoRef.current[videoId]
        const duration = hightlightsSlides[videoId]?.videoDuration
        if (!currentVideo || !duration) return
        anim.progress(currentVideo.currentTime / duration)
      }

      if (isPlaying) {
        gsap.ticker.add(animUpdate)
      } else {
        gsap.ticker.remove(animUpdate)
      }

      return () => gsap.ticker.remove(animUpdate)
    }
  }, [videoId, startPlay])

  const handleProcess = (type, i) => {
    switch (type) {
      case 'video-end':
        setVideo((prev) => ({ ...prev, isEnd: true, videoId: i + 1 }))
        break
      case 'video-last':
        setVideo((prev) => ({ ...prev, isLastVideo: true }))
        break
      case 'video-reset':
        setVideo((prev) => ({ ...prev, isLastVideo: false, videoId: 0 }))
        break
      case 'play':
      case 'pause':
        setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
        break
      default:
        return video
    }
  }

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black relative">
                {/* Per-video loading spinner */}
                {!readyVideos[i] && (
                  <div className="absolute inset-0 flex-center bg-black z-10">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  </div>
                )}

                <video
                  id="video"
                  playsInline
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  className={`${
                    list.id === 2 ? 'translate-x-44' : ''
                  } pointer-events-none transition-opacity duration-500 ${
                    readyVideos[i] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onCanPlay={() =>
                    setReadyVideos((prev) => ({ ...prev, [i]: true }))
                  }
                  onPlay={() =>
                    setVideo((prev) => ({ ...prev, isPlaying: true }))
                  }
                  onEnded={() =>
                    i !== 3
                      ? handleProcess('video-end', i)
                      : handleProcess('video-last')
                  }
                  onLoadedMetadata={(e) =>
                    setVideo((prev) => ({ ...prev, loadedData: [...(prev.loadedData || []), e] }))
                  }
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
            onClick={
              isLastVideo
                ? () => handleProcess('video-reset')
                : !isPlaying
                ? () => handleProcess('play')
                : () => handleProcess('pause')
            }
          />
        </button>
      </div>
    </>
  )
}

export default VideoCarousel