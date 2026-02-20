import { lazy, Suspense } from 'react'

const Hero = lazy(() => import("../components/Hero"))
const Highlights = lazy(() => import("../components/Highlights"))
const Model = lazy(() => import("../components/Model"))
const Features = lazy(() => import("../components/Features"))
const HowItWorks = lazy(() => import("../components/HowItWorks"))

import SimpleLoader from "../components/SimpleLoader"

const HomePage = () => (
  <>
    <Suspense fallback={<SimpleLoader />}>
        <Hero />
        <Highlights />
        <Model />
        <Features />
        <HowItWorks />
    </Suspense>
  </>
)

export default HomePage