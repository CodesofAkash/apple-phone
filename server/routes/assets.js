router.get('/scene.glb', (req, res) => {
  const cloudinaryUrl = 'https://res.cloudinary.com/ddawd3kp5/image/upload/v1772641137/scene_h7hwag.glb'

  res.set({
    'Content-Type': 'model/gltf-binary',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Access-Control-Allow-Origin': '*',
    'Content-Encoding': 'identity', // ← add this — disables compression for binary
  })

  https.get(cloudinaryUrl, (upstream) => {
    upstream.pipe(res)
  }).on('error', (err) => {
    console.error('GLB proxy error:', err)
    res.status(502).json({ error: 'Failed to fetch model' })
  })
})