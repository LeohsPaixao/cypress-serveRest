import { defineConfig } from 'cypress';

export default defineConfig({
  trashAssetsBeforeRuns: false,
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  watchForFileChanges: false,
  defaultCommandTimeout: 60 * 1000,
  pageLoadTimeout: 120 * 1000,
  video: false,

  e2e: {
    specPattern: './cypress/e2e/**/*.cy.ts',
    baseUrl: 'http://localhost:3000',
    screenshotsFolder: './cypress/results/screenshots',
    fixturesFolder: './cypress/fixtures',
    retries: {
      experimentalStrategy: 'detect-flake-but-always-fail',
      experimentalOptions: {
        maxRetries: 2,
        stopIfAnyPassed: false,
      },
      openMode: false,
      runMode: true,
    },
  },
});
