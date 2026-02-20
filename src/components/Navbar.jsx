import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { appleImg } from '../utils'

const Navbar = memo(() => {
  const { user, isAuthenticated, signout } = useAuth()
  const { getCartCount } = useCart()
  
  const navItems = ['About', 'Contact']
  const cartCount = getCartCount()

  const handleSignOut = async () => {
    await signout()
  }

  return (
    <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
      <nav className="flex w-full screen-max-width" aria-label="Main navigation">
        <Link 
          to="/" 
          className="hover:opacity-70 transition-opacity"
          aria-label="Go to homepage"
        >
          <img src={appleImg} alt="Apple" width={14} height={18} loading="eager" />
        </Link>

        <div className="flex flex-1 justify-center max-sm:hidden">
          {navItems.map((nav) => (
            <Link
              key={nav}
              to={`/${nav.toLowerCase()}`}
              className="px-5 text-sm cursor-pointer text-gray hover:text-white transition-all"
              aria-label={`Go to ${nav}`}
            >
              {nav}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5 max-sm:justify-end max-sm:flex-1">
          {isAuthenticated && user ? (
            <>
              <span className="text-sm text-gray-400 hidden sm:block truncate max-w-[120px]">
                Hi, {user.name || user.email?.split('@')[0]}
              </span>
              <Link
                to="/orders"
                className="text-gray hover:text-white transition-colors text-sm font-medium"
                aria-label="View orders"
              >
                Orders
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray hover:text-white transition-colors text-sm font-medium"
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-gray hover:text-white transition-colors text-sm font-medium"
                aria-label="Sign in"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-gray hover:text-white transition-colors text-sm font-medium"
                aria-label="Sign up"
              >
                Sign Up
              </Link>
            </>
          )}
          
          <Link 
            to="/cart" 
            className="relative hover:opacity-70 transition-opacity group"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <svg 
              className="w-[18px] h-[18px] text-gray group-hover:text-white transition-colors" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-linear-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar