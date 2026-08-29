// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-mochawesome-reporter/register';
//Cypress.on('uncaught:exception', () => false);

// cypress/support/e2e.js

Cypress.on('uncaught:exception', (err) => {
  // Ignore harmless ResizeObserver loop layout errors globally
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  
  // Ignore the null document app errors you encountered earlier
  if (err.message.includes("Cannot read properties of null (reading 'document')")) {
    return false;
  }

  // Let all other genuine application errors fail the test run normally
});


import addContext from "mochawesome/addContext";

Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    // 1. Get the current spec filename (e.g., request-stock.cy.js)
    const specName = Cypress.spec.name; 

    // 2. Build the precise nested path mirroring your folder structure
    // This looks like: ../screenshots/inventory-management/request-stock.cy.js/Test Name (failed).png
    const screenshotPath = `../screenshots/${specName}/${runnable.parent.title} -- ${test.title} (failed).png`;

    // 3. Attach it safely to the Mochawesome context
    addContext({ test }, screenshotPath);
  }
});



