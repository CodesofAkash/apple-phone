import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const BlockedTokenModal = () => {
  const { sessionExpired, dismissSessionExpiredModal } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionExpired) {
      navigate('/signin', { replace: true })
    }
  }, [sessionExpired, navigate])

  if (!sessionExpired) {
    return null
  }

  const handleReauth = () => {
    dismissSessionExpiredModal()
    navigate('/signin', { replace: true })
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-red-500/30 bg-zinc-900/90 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
          <svg className="h-6 w-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white">Session expired</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Your token expired or was blocked. Please sign in again to continue.
        </p>
        <button
          type="button"
          onClick={handleReauth}
          className="mt-6 w-full rounded-xl bg-red-500/90 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Sign in again
        </button>
      </div>
    </div>
  )
}

export default BlockedTokenModal
