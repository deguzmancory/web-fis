module.exports = {
  globDirectory: 'build/',
  globPatterns: ['**/*.{ico,html,png,jpg,jpeg,svg,json,txt,css,js,woff,ttf}'],
  globIgnores: ['index.html', '**/index.html'],
  maximumFileSizeToCacheInBytes: 15 * 1000 * 1000, // 15MB
  swDest: 'build/service-worker.js',
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
};
