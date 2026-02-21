import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SimpleLoader from './components/SimpleLoader'
import ErrorBoundary from './components/ErrorBoundary'
import BlockedTokenModal from './components/BlockedTokenModal'
import * as Sentry from '@sentry/react'

const HomePage = lazy(() => import('./pages/HomePage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const SigninPage = lazy(() => import('./pages/SigninPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'))
const SalesPolicyPage = lazy(() => import('./pages/SalesPolicyPage'))
const SiteMapPage = lazy(() => import('./pages/SiteMapPage'))


const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              theme="dark"
              richColors
              closeButton
              expand={true}
            />
            <BlockedTokenModal />
            <div className="bg-black min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<SimpleLoader />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/signin" element={<SigninPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
                    <Route path="/product/:slug" element={<ProductDetailPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                    <Route path="/sales-policy" element={<SalesPolicyPage />} />
                    <Route path="/sitemap" element={<SiteMapPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default import.meta.env.PROD ? Sentry.withProfiler(App) : App