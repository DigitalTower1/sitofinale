module.exports = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    screenEmulation: { mobile: true, width: 375, height: 667, deviceScaleFactor: 2, disabled: false },
    throttling: {
      rttMs: 70,
      throughputKbps: 7500,
      cpuSlowdownMultiplier: 2
    },
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
  }
};
