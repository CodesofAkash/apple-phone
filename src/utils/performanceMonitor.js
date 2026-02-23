export const performanceMonitor = {
  marks: new Map(),

  mark(name) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
      this.marks.set(name, Date.now());
    }
  },

  measure(name, startMark, endMark) {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
      } catch (e) {
        console.warn(`Performance measurement failed for ${name}:`, e);
      }
    }
  },

  getMetrics() {
    if (typeof window !== 'undefined' && window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      return {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.requestStart,
        download: timing.responseEnd - timing.responseStart,
        domInteractive: timing.domInteractive - timing.navigationStart,
        domComplete: timing.domComplete - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
      };
    }
    return null;
  },

  logWebVitals() {
    if (typeof window !== 'undefined' && 'web-vital' in window) {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = window['web-vital'];
      
      getCLS(metric => console.log('CLS:', metric.value));
      getFID(metric => console.log('FID:', metric.value));
      getFCP(metric => console.log('FCP:', metric.value));
      getLCP(metric => console.log('LCP:', metric.value));
      getTTFB(metric => console.log('TTFB:', metric.value));
    }
  },
};
