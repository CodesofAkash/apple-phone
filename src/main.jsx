import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import * as Sentry from '@sentry/react'

// Only initialize Sentry in production
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
    // Reduce sampling in production for cost efficiency
    tracesSampleRate: 0.1,
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/.*\.supabase\.co/,
      /^https:\/\/codesofakash\.site/,
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      // Filter out non-critical errors
      if (event.exception) {
        const error = event.exception.values?.[0]
        if (error?.value) {
          // Ignore ResizeObserver errors
          if (error.value.includes('ResizeObserver')) return null
          // Ignore GSAP errors that don't affect functionality
          if (error.value.includes('GSAP') && !error.value.includes('fatal')) return null
          // Ignore network errors from ad blockers
          if (error.value.includes('Failed to fetch') && error.value.includes('ad')) return null
        }
      }
      return event
    },
  })
}

// Get root element with error handling
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find root element')
}

// Render app
createRoot(rootElement).render(
    <App />
)