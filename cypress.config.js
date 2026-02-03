

const { defineConfig } = require('cypress')

module.exports = defineConfig({

  e2e: {
    baseUrl :"https://qaapp.bas.ng",

    },

    

    setupNodeEvents(on, config)
     {
      // implement node event listeners here
require('...cypress-mochawesome-reporter/plugin')(on);}
      

});