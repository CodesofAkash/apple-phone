import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    sentryVitePlugin({
      org: "codesofakash",
      project: "apple-phone",
      authToken: process.env.SENTRY_AUTH_TOKEN
    }),
  ],

  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
    },
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1500, // raise this — three.js will always be large
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'gsap': ['gsap', '@gsap/react'],
          'payments': ['@stripe/react-stripe-js', '@stripe/stripe-js'],
        },
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({name}) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'images/[name]-[hash][extname]';
          } else if (/\.css$/.test(name ?? '')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'three', '@react-three/fiber', '@react-three/drei', 'gsap', '@gsap/react'],
    esbuildOptions: {
      target: 'esnext',
    }
  },

  server: {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    }
  }
})