import {
    blackImg,
    blueImg,
    highlightFirstVideo,
    highlightFourthVideo,
    highlightSecondVideo,
    highlightThirdVideo,
    whiteImg,
    yellowImg,
  } from "../utils";

// ============================================================================
// CONSTANTS CONFIGURATION FILE
// ============================================================================
// This file centralizes all configurable data for the Apple iPhone 15 Pro website.
// Modify ONLY the values in each section below to customize the entire application.
// ============================================================================

// ============================================================================
// 1. SITE METADATA & BRANDING
// ============================================================================
export const SITE_CONFIG = {
  siteName: "Apple Phone 20 Pro",
  siteTitle: "Apple Phone 20 Pro | Premium Smartphone",
  description: "Experience the power of Apple Phone 20 Pro with A17 Pro chip and titanium design",
  productName: "Apple Phone 20 Pro",
  brandName: "CodesOfAkash",
  copyrightYear: 2026,
};

// ============================================================================
// 2. NAVIGATION CONFIGURATION
// ============================================================================
export const navLists = [
  { label: "About Me", link: "/about" },
  { label: "Contact Me", link: "/contact" },
];

export const NAV_CONFIG = {
  items: navLists,
  logoAlt: "CodesOfAkash",
  searchAlt: "search",
  bagAlt: "bag",
};

// ============================================================================
// 3. HERO SECTION CONFIGURATION
// ============================================================================
export const HERO_CONFIG = {
  title: "Apple phone 20 Pro",
  ctaText: "Buy",
  ctaLink: "#highlights",
  priceText: "From ₹19999/month or ₹199999",
  mobileBreakpoint: 760, // Switch video at this width
};

// ============================================================================
// 4. HIGHLIGHTS/VIDEO CAROUSEL CONFIGURATION
// ============================================================================
export const hightlightsSlides = [
  {
    id: 1,
    textLists: [
      "Enter A17 Pro.",
      "Game‑changing chip.",
      "Groundbreaking performance.",
    ],
    video: highlightFirstVideo,
    videoDuration: 4,
  },
  {
    id: 2,
    textLists: ["Titanium.", "So strong. So light. So Pro."],
    video: highlightSecondVideo,
    videoDuration: 5,
  },
  {
    id: 3,
    textLists: [
      "Apple phone 20 Pro has the",
      "longest optical zoom in",
      "Apple phone ever. Far out.",
    ],
    video: highlightThirdVideo,
    videoDuration: 2,
  },
  {
    id: 4,
    textLists: ["All-new Action button.", "What will yours do?."],
    video: highlightFourthVideo,
    videoDuration: 3.63,
  },
];

export const HIGHLIGHTS_CONFIG = {
  title: "Get the highlights.",
  slides: hightlightsSlides,
  autoAdvanceOnEnd: true,
  progressBarMobileWidth: "10vw",
  progressBarTabletWidth: "10vw",
  progressBarDesktopWidth: "4vw",
  progressBarSize: "12px",
};

// ============================================================================
// 5. iPhone MODEL CONFIGURATION
// ============================================================================
export const models = [
  {
    id: 1,
    title: "Apple phone 20 Pro in Natural Titanium",
    color: ["#8F8A81", "#ffe7b9", "#6f6c64"],
    img: yellowImg,
  },
  {
    id: 2,
    title: "Apple phone 20 Pro in Blue Titanium",
    color: ["#53596E", "#6395ff", "#21242e"],
    img: blueImg,
  },
  {
    id: 3,
    title: "Apple phone 20 Pro in White Titanium",
    color: ["#C9C8C2", "#ffffff", "#C9C8C2"],
    img: whiteImg,
  },
  {
    id: 4,
    title: "Apple phone 20 Pro in Black Titanium",
    color: ["#454749", "#3b3b3b", "#181819"],
    img: blackImg,
  },
];

export const sizes = [
  { label: '6.1"', value: "small" },
  { label: '6.7"', value: "large" },
];

export const MODEL_CONFIG = {
  title: "Take a closer look.",
  models: models,
  sizes: sizes,
  defaultSize: "small",
  defaultModel: models[0],
  modelViewHeight: {
    mobile: "h-[75vh]",
    desktop: "md:h-[90vh]",
  },
  headingDelay: 2,
};

// ============================================================================
// 6. FEATURES SECTION CONFIGURATION
// ============================================================================
export const FEATURES_CONFIG = {
  title: "Explore the full story.",
  subtitle: "Apple phone 20 Pro.",
  subtitleSecond: "Forged in titanium",
  featureText1: "Apple phone 20 Pro is the first Apple phone to feature an aerospace-grade titanium design, using the same alloy that spacecrafts use for missions to Mars.",
  featureText2: "Titanium has one of the best strength-to-weight ratios of any metal, making these our lightest Pro models ever. You'll notice the difference the moment you pick one up.",
  animationScrubValue: 5.5,
};

// ============================================================================
// 7. HOW IT WORKS SECTION CONFIGURATION
// ============================================================================
export const HOW_IT_WORKS_CONFIG = {
  chipTitle: "A17 Pro chip.",
  chipSubtitle: "A monster win for gaming.",
  chipDescription: "It's here. The biggest redesign in the history of Apple GPUs.",
  gameTitle: "Honkai: Star Rail",
  gpuSpecText: "Pro-class GPU",
  gpuCoreCount: "with 6 cores",
  featureText1: "A17 Pro is an entirely new class of iPhone chip that delivers our best graphic performance by far.",
  featureText2: "Mobile games will look and feel so immersive, with incredibly detailed environments and characters.",
  scrollTriggerStart: "20% bottom",
};

// ============================================================================
// 8. FOOTER CONFIGURATION
// ============================================================================
export const footerLinks = [
  { text: "Privacy Policy", link: "/privacy-policy" },
  { text: "Terms of Use", link: "/terms-of-use" },
  { text: "Sales Policy", link: "/sales-policy" },
  { text: "Site Map", link: "/sitemap" },
];

export const FOOTER_CONFIG = {
  links: footerLinks,
  shopMoreText: "More ways to shop:",
  findStoreLink: "Find an Apple Store",
  retailerLink: "other retailer",
  phoneText: "More ways to shop:",
  phoneNumber: "00000-040-1966",
  copyright: `Copyright @ ${SITE_CONFIG.copyrightYear} ${SITE_CONFIG.brandName} Inc. All rights reserved.`,
  linkSeparator: "|",
};

// ============================================================================
// 9. ANIMATION CONFIGURATION
// ============================================================================
export const ANIMATION_CONFIG = {
  // Hero animations
  hero: {
    titleDelay: 1.5,
    ctaDelay: 2,
    ctaDistance: -50,
    ease: "power1.in",
    easeComplex: "power2.inOut",
  },

  // Highlights animations
  highlights: {
    titleDuration: 1,
    linkStagger: 0.25,
    linkDuration: 1,
    slideTransition: 2,
    videoScrollStart: "-10% bottom",
  },

  // Features animations
  features: {
    textDuration: 2,
    scrollScrub: 5.5,
    easeType: "power2.inOut",
  },

  // Model animations
  model: {
    slideDelay: 2,
    slideEase: "power2.inOut",
  },

  // How it works animations
  howItWorks: {
    chipDuration: 2,
    chipScale: 2,
    chipEase: "power2.inOut",
  },

  // Default scroll trigger values
  scrollTrigger: {
    toggleActions: "restart reverse restart reverse",
    start: "top-85%",
  },
};

// ============================================================================
// 10. SIZE BREAKPOINTS & MEDIA QUERIES
// ============================================================================
export const BREAKPOINTS = {
  mobile: 640,    // sm
  tablet: 768,    // md
  desktop: 1024,  // lg
  wide: 1280,     // xl
  ultraWide: 1536, // 2xl
  mobileVideoBreakpoint: 760,
  tabletVideoBreakpoint: 1200,
};

// ============================================================================
// 11. 3D VIEWPORT CONFIGURATION
// ============================================================================
export const VIEWPORT_CONFIG = {
  width: "100%",
  height: "100%",
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  overflow: "hidden",
  canvasClassName: "w-full h-full",
};

// ============================================================================
// 12. COLOR CONFIGURATION
// ============================================================================
export const COLORS = {
  primary: "#000000",     // Black background
  secondary: "#ffffff",   // White text
  accent: "#3b82f6",      // Blue links
  gray: "#9ca3af",        // Gray text
  lightGray: "#f3f4f6",   // Light gray bg
  neutral: "#71717a",     // Neutral gray
};

// ============================================================================
// 13. TYPOGRAPHY & SPACING
// ============================================================================
export const TYPOGRAPHY = {
  // Font sizes (Tailwind scale)
  headingLarge: "text-7xl",
  headingMedium: "text-5xl",
  headingSmall: "text-2xl",
  bodyLarge: "text-lg",
  bodyMedium: "text-base",
  bodySmall: "text-sm",
  bodyXSmall: "text-xs",

  // Font weights
  light: "font-light",
  normal: "font-normal",
  semibold: "font-semibold",
  bold: "font-bold",
};

export const SPACING = {
  common: "common-padding",
  screenMax: "screen-max-width",
};

// ============================================================================
// 14. PRICE CONFIGURATION
// ============================================================================
export const PRICING = {
  currency: "$",
  currencySymbol: "£",
  monthlyPrice: 199,
  outright: 999,
  displayText: "From £199/month or $999",
};

// ============================================================================
// 15. VIDEO CONFIGURATION
// ============================================================================
export const VIDEO_CONFIG = {
  autoplay: true,
  muted: true,
  controls: false,
  playsInline: true,
  preload: "none",
  type: "video/mp4",
};

// ============================================================================
// 16. ACCESSIBILITY CONFIGURATION
// ============================================================================
export const ACCESSIBILITY = {
  focusColor: "#3b82f6",
  focusWidth: "2px",
  highContrast: true,
};

// ============================================================================
// 17. EXPORT SUMMARY
// ============================================================================
// All exports are organized above. The main exports used throughout the app:
// - navLists: Navigation items
// - hightlightsSlides: Video carousel data
// - models: iPhone color variants
// - sizes: Screen size options
// - footerLinks: Footer link items
//
// Plus all CONFIG objects for advanced customization.