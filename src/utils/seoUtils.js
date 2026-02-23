export const siteMetadata = {
  siteTitle: 'Apple Phone 20 Pro | Premium Smartphone with A17 Pro',
  siteDescription: 'Experience the power of Apple Phone 20 Pro with A17 Pro chip, 120Hz display, and titanium design. Premium smartphone with advanced features.',
  siteUrl: 'https://codesofakash.site',
  siteName: 'Apple Phone 20 Pro',
};

export const generateMetaTags = (page) => {
  const baseUrl = siteMetadata.siteUrl;
  const pages = {
    home: {
      title: 'Apple Phone 20 Pro | Premium Smartphone',
      description: 'Experience the power of Apple Phone 20 Pro with A17 Pro chip and titanium design.',
      path: '/',
      image: '/assets/images/apple.svg',
    },
    products: {
      title: 'Shop Apple Phone 20 Pro',
      description: 'Browse and customize your Apple Phone 20 Pro with various colors and storage options.',
      path: '/products/apple-phone',
      image: '/assets/images/apple.svg',
    },
    cart: {
      title: 'Shopping Cart | Apple Phone 20 Pro',
      description: 'Review your shopping cart and proceed to checkout.',
      path: '/cart',
      image: '/assets/images/bag.svg',
    },
    about: {
      title: 'About Apple Phone 20 Pro',
      description: 'Learn about the features and innovations of Apple Phone 20 Pro.',
      path: '/about',
      image: '/assets/images/apple.svg',
    },
    contact: {
      title: 'Contact Us | Apple Phone 20 Pro',
      description: 'Get in touch with our support team for any inquiries.',
      path: '/contact',
      image: '/assets/images/apple.svg',
    },
  };

  return pages[page] || pages.home;
};

export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'CodesOfAkash',
    'url': siteMetadata.siteUrl,
    'logo': `${siteMetadata.siteUrl}/assets/images/apple.svg`,
    'sameAs': [
      'https://twitter.com/codesofakash',
      'https://github.com/codesofakash',
    ],
  },
  product: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': 'Apple Phone 20 Pro',
    'description': siteMetadata.siteDescription,
    'image': `${siteMetadata.siteUrl}/assets/images/apple.svg`,
    'brand': {
      '@type': 'Brand',
      'name': 'CodesOfAkash',
    },
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'INR',
      'lowPrice': '199999',
      'highPrice': '299999',
    },
  },
  breadcrumb: (path) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': siteMetadata.siteUrl,
      },
      ...path.split('/').filter(Boolean).map((segment, index, array) => ({
        '@type': 'ListItem',
        'position': index + 2,
        'name': segment.charAt(0).toUpperCase() + segment.slice(1),
        'item': `${siteMetadata.siteUrl}/${array.slice(0, index + 1).join('/')}`,
      })),
    ],
  }),
};
