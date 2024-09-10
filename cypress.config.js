const { defineConfig } = require('cypress');

module.exports = defineConfig({
  trashAssetsBeforeRuns: false,
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  watchForFileChanges: false,
  defaultCommandTimeout: 60 * 1000,
  pageLoadTimeout: 120 * 1000,
  video: false,

  e2e: {
    specPattern: './cypress/e2e/**/*.cy.*',
    baseUrl: 'http://localhost:3000',
    screenshotsFolder: './cypress/results/screenshots',
    fixturesFolder: './cypress/fixtures',
    retries: {
      runMode: 1,
      openMode: 0,
    }
  },
});