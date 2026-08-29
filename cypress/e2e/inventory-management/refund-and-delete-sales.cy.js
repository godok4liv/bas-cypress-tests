

describe('product sales refund automation workflow', () => {
  const baseUrl = 'https://qaapp.bas.ng/godokpharmglobalenterprise/login';
    const saleRepEmail = 'otester777@gmail.com'
    const saleRepPassword = 'Eazerd123@'

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('should successfully login into admin account and complete refund to customer wallet', () => {
    // Fill in the Email field
    cy.get('input[type="email"], input[name="email"]')
      .should('be.visible')
      .clear()
      .type(saleRepEmail);

    // Fill in the Password field (replace with your secure password or Cypress.env variable)
    cy.get('input[type="password"]')
      .should('be.visible')
      .clear()
      .type(saleRepPassword);

    // Click the Log In button
    cy.contains('button', 'Log In')
      .should('be.enabled')
      .click({ force: true });

   // ----------------------------------------------------
    // 2. SELECT BRANCH & UNIT TYPE
    // ----------------------------------------------------
    cy.contains('button, div, span', 'Branch (Calabar Municipal)')
      .should('be.visible')
      .click({ force: true });

    cy.contains('button, span, div', 'Unit').click({ force: true });

    // ----------------------------------------------------
    // 3. ADD PRODUCTS TO CART
    // ----------------------------------------------------
    cy.get('input[placeholder*="Search products or scan barcode..."]')
      .should('be.visible')
      .clear()
      .type('v', { delay: 100 });

    cy.contains('div, li, span', 'vitamin K')
      .scrollIntoView({ duration: 400 })
      .should('be.visible')
      .click({ force: true });

    cy.get('input[placeholder*="Search products or scan barcode..."]')
      .clear()
      .type('po', { delay: 100 });

    cy.contains('div, li, span', 'Potassium')
      .should('be.visible')
      .click({ force: true });

// 5. CASH PAYMENT MODAL & CANCEL TEST
    // ----------------------------------------------------
    cy.contains('button', /Pay With Cash/i)
      .scrollIntoView({ duration: 300 })
      .should('be.visible')
      .click({ force: true });

    cy.get('[role="dialog"], .modal').within(() => {
      cy.contains('button', /Cancel/i).click({ force: true });
    });

    cy.get('[role="dialog"], .modal').should('not.exist');

    cy.contains('button', /Pay With Cash/i)
      .scrollIntoView({ duration: 300 })
      .click({ force: true });

    // ----------------------------------------------------
    // 6. ENTER TENDERED AMOUNT & PROCESS SALE
    // ----------------------------------------------------
    cy.get('[role="dialog"], .modal').within(() => {
      cy.contains('div, p, span', /Total Due/i)
        .parent()
        .invoke('text')
        .then((totalDueText) => {
          const amountToTender = parseCurrency(totalDueText);

          cy.get('input[placeholder*="amount"]')
            .should('be.visible')
            .clear()
            .type(`${amountToTender}`);
        });

      cy.contains('button', /Process Sale & Print Receipt/i)
        .should('be.visible')
        .click({ force: true });
    });




    

    // STEP 1: VERIFY TABLE CONTENT IS FULLY LOADED
// ------------------------------------------------------------------
// Confirms that the main sales history data grid is visible and populated
cy.get('table, [role="table"], tbody').should('be.visible');
cy.contains('td, div, span', '#48').should('be.visible'); // Guarantees rows exist

// STEP 2: DYNAMIC RANDOM ROW SELECTION & NAVIGATION
// ------------------------------------------------------------------
cy.get('tbody tr, table tbody tr, [class*="row"]')
  .filter(':visible') // Scopes only to rows currently displayed on screen
  .then(($rows) => {
    const rowCount = $rows.length;
    const randomIndex = Math.floor(Math.random() * rowCount);
    
    cy.log(`🎲 Discovered ${rowCount} total sales records. Activating Row Index: ${randomIndex}`);

    // Isolate the selected row component
    const selectedRow = cy.wrap($rows).eq(randomIndex);

    // 1. Extract the Invoice ID text value dynamically for post-navigation assertions
    selectedRow.find('td, div, span')
      .contains('#')
      .invoke('text')
      .then((invoiceId) => {
        const cleanInvoiceId = invoiceId.trim();
        cy.log(`📋 Targeted Invoice ID: ${cleanInvoiceId}`);

        // 2. Click the random row to launch the detail redirection flow
        cy.wrap($rows)
          .eq(randomIndex)
          .scrollIntoView()
          .click({ force: true });

        // STEP 3: DETAIL PAGE VIEW REDIRECT VALIDATION
        // ------------------------------------------------------------------
        cy.wait(1500); // Buffer for view transition layouts to load completely
        
        // Verifies the URL has updated correctly to match the details sub-route
        cy.url().should('include', '/details'); 

        // Confirms the extracted Invoice ID successfully renders on the detailed layout canvas
        cy.get('body')
          .should('contain', cleanInvoiceId);
      });
  });













  });













//   it('should successfully log into POS sale rep account and complete refund to customer wallet', () => {
//     cy.get('input[type="email"], input[name="email"]')
//       .type('godokliv84@gmail.com');

//     cy.get('input[type="password"]')
//       .type('short');

//     // Assert that the validation text is visible
//     cy.contains('Password must be at least 8 characters')
//       .should('be.visible');
 // });



});
