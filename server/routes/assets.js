import express from 'express'
import https from 'https'

const router = express.Router()

// Proxy the GLB from Cloudinary with the correct content-type header.
// Cloudinary stores it under /image/upload/ and serves it as image/jpeg,
// which causes Three.js GLTFLoader to reject it silently.
// This route fetches it server-side and re-serves with model/gltf-binary.
router.get('/scene.glb', (req, res) => {
  const cloudinaryUrl = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772237642/scene_bc9yxr.glb'

  res.set({
    'Content-Type': 'model/gltf-binary',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Access-Control-Allow-Origin': '*',
  })

  https.get(cloudinaryUrl, (upstream) => {
    upstream.pipe(res)
  }).on('error', (err) => {
    console.error('GLB proxy error:', err)
    res.status(502).json({ error: 'Failed to fetch model' })
  })
})

export default router