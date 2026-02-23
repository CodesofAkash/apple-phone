export const imageOptimization = {
  getOptimizedImageUrl(url, width, quality = 80) {
    if (!url) return '';

    if (typeof cloudinary !== 'undefined') {
      return cloudinary.url(url, {
        width,
        quality: `q_${quality}`,
        fetch_format: 'auto',
      });
    }

    return url;
  },

  getResponsiveImageSet(url) {
    return {
      mobile: this.getOptimizedImageUrl(url, 480),
      tablet: this.getOptimizedImageUrl(url, 768),
      desktop: this.getOptimizedImageUrl(url, 1920),
    };
  },

  createLazyImageElement(url, alt, sizes = '100vw', className = '') {
    const img = document.createElement('img');
    img.className = className;
    img.alt = alt;
    img.loading = 'lazy';
    img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect fill="%23f0f0f0" width="3" height="2"/></svg>';
    img.dataset.src = url;
    img.sizes = sizes;

    return img;
  },

  observeLazyImages(selector = '[data-src]') {
    if (!('IntersectionObserver' in window)) {
      const images = document.querySelectorAll(selector);
      images.forEach(img => {
        img.src = img.dataset.src;
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px',
    });

    document.querySelectorAll(selector).forEach(img => {
      observer.observe(img);
    });

    return observer;
  },
};
