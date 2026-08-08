const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://bas.ng",
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Explicitly defines your custom spec layout matching the project explorer
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: true,
      html: true,
      json: true,
      timestamp: 'mmddyyyy_HHMMss',
      showSkipped: true,
      charts: true
    },

    setupNodeEvents(on, config) {
      // Binds the Mochawesome plugin listener to compile automated artifacts on run completion
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});
