const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 2000,
  pageLoadTimeout: 100000,
  videosFolder: 'cypress/videos/testExecutionVideos',
  viewportHeight: 1080,
  viewportWidth: 1920,
  
  projectId: 'xhef6e',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  experimentalStudio: true,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    excludeSpecPattern: '**/other/*',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
