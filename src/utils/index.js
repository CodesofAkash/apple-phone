// ─── Cloudinary URLs ─────────────────────────────────────────────────────────
// All heavy assets served from Cloudinary CDN instead of bundled in Vercel

// Videos
export const heroVideo           = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772161077/hero_duyvcp.mp4'
export const smallHeroVideo      = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772161078/smallHero_szet5y.mp4'
export const highlightFirstVideo = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772161081/highlight-first_xvyx6z.mp4'
export const highlightSecondVideo = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772161094/hightlight-third_k4auvk.mp4'
export const highlightThirdVideo = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772161067/hightlight-sec_oxr7z1.mp4'
export const highlightFourthVideo = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772161093/hightlight-fourth_hj4ig8.mp4'
export const exploreVideo        = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772161087/explore_babd9p.mp4'
export const frameVideo          = 'https://res.cloudinary.com/ddawd3kp5/video/upload/v1772161092/frame_gbj015.mp4'

// Phone colour images
export const yellowImg   = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162526/yellow_nonlnh.jpg'
export const blueImg     = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162503/blue_jhw8ea.jpg'
export const whiteImg    = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162511/white_xngfzk.jpg'
export const blackImg    = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162423/black_njj7wt.jpg'

// Section images
export const heroImg     = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162415/hero_gczgur.jpg'
export const explore1Img = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162368/explore1_zwzw1j.jpg'
export const explore2Img = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162390/explore2_fhpcpr.jpg'
export const chipImg     = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162398/chip_z8re30.jpg'
export const frameImg    = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162374/frame_hwrbrt.png'

// Icons
export const appleImg  = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162335/apple_aspv2g.svg'
export const searchImg = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162389/search_cfwb9b.svg'
export const bagImg    = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162335/bag_rrxtou.svg'
export const watchImg  = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162391/watch_w58iso.svg'
export const rightImg  = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162384/right_etoscq.svg'
export const replayImg = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162382/replay_zo4nxk.svg'
export const playImg   = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162381/play_r4yu7b.svg'
export const pauseImg  = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772162377/pause_v6fl77.svg'


export const sceneGlb = 'https://apple-phone-production.up.railway.app/api/assets/scene.glb'

// ─── Utility ─────────────────────────────────────────────────────────────────
export const formatIndianCurrency = (amount) =>
  Number(amount).toLocaleString('en-IN')