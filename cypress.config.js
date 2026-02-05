

const { defineConfig } = require('cypress');


module.exports = defineConfig({

  e2e: {
    baseUrl: "https://qaapp.bas.ng",

      reporter: 'cypress-mochawesome-reporter',


      // Increase global timeout from 4,000ms to 10,000ms (10 seconds)
         defaultCommandTimeout: 10000,
        // You can also increase page load timeouts for slow redirects
         pageLoadTimeout: 30000,

    setupNodeEvents(on, config) {
      // The reporter plugin must be inside the e2e block
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});