// ─── Cloudinary URLs ─────────────────────────────────────────────────────────
// All heavy assets served from Cloudinary CDN instead of bundled in Vercel

// Videos
export const heroVideo            = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772641285/hero_j3tb1j.mp4'
export const smallHeroVideo       = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772641234/smallHero_csm23y.mp4'
export const highlightFirstVideo  = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772641298/highlight-first_ajr41u.mp4'
export const highlightSecondVideo = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772641299/hightlight-third_gyi6wc.mp4'
export const highlightThirdVideo  = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772641223/hightlight-sec_twxepc.mp4'
export const highlightFourthVideo = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772641248/hightlight-fourth_yyw5r7.mp4'
export const exploreVideo         = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772641299/explore_zcz3vj.mp4'
export const frameVideo           = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772641248/frame_sivjln.mp4'

// Phone colour images
export const yellowImg = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641209/yellow_n2sn0u.jpg'
export const blueImg   = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641181/blue_pkxiic.jpg'
export const whiteImg  = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641204/white_akqtqw.jpg'
export const blackImg  = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641169/black_h3qauy.jpg'

// Section images
export const heroImg     = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641186/hero_jqfwbg.jpg'
export const explore1Img = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641180/explore1_iarrew.jpg'
export const explore2Img = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641182/explore2_pp0aah.jpg'
export const chipImg     = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641175/chip_phiui5.jpg'
export const frameImg    = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641184/frame_s9dyxo.png'

// Icons
export const appleImg  = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641171/apple_qccove.svg'
export const searchImg = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641197/search_xen8zb.svg'
export const bagImg    = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641173/bag_oauuau.svg'
export const watchImg  = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641199/watch_ifteo4.svg'
export const rightImg  = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641195/right_dgfihq.svg'
export const replayImg = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641193/replay_tkygof.svg'
export const playImg   = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641191/play_wwkqjb.svg'
export const pauseImg  = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641189/pause_s1rlhd.svg'

export const sceneGlb = 'https://apple-phone-production.up.railway.app/api/assets/scene.glb'

// ─── Utility ─────────────────────────────────────────────────────────────────
export const formatIndianCurrency = (amount) =>
  Number(amount).toLocaleString('en-IN')