import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import * as Sentry from '@sentry/react'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/.*\.supabase\.co/,
      /^https:\/\/codesofakash\.site/,
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      if (event.exception) {
        const error = event.exception.values?.[0]
        if (error?.value) {
          if (error.value.includes('ResizeObserver')) return null
          if (error.value.includes('GSAP') && !error.value.includes('fatal')) return null
          if (error.value.includes('Failed to fetch') && error.value.includes('ad')) return null
        }
      }
      return event
    },
  })
}

// Only register service worker in production — in dev it causes confusing
// stale cache issues where you change code but see old results
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((err) => {
      console.warn('Service worker registration failed:', err)
    })
  })
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find root element')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)