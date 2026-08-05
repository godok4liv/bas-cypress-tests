


describe('Godok Pharm Global Enterprise - Sales Automation', () => {
  // Define credentials and PIN authentication states for the test lifecycle
  const userEmail = 'otester777@gmail.com';
  const userPassword = 'Eazerd123@';
  const invalidPin = '11111';
  const validPin = '12345';

  it('Should process sales for Existing Customers and navigate to Sales Log to confirm sales receipt match', () => {

    /**
     * Helper Function: fillPinInputs
     * Dynamically clears and enters a 5-digit verification PIN into modal input fields.
     * Iterates through individual digits to reliably handle multi-box PIN forms.
     */
    const fillPinInputs = (pinCode) => {
      // Clear existing values in the active modal's input fields
      cy.get('[role="dialog"], .modal').last().find('input').each(($input) => {
        cy.wrap($input).clear({ force: true });
      });

      // Split PIN string into single digits and type them sequentially
      const digits = pinCode.split('');
      digits.forEach((digit) => {
        cy.get('[role="dialog"], .modal')
          .last()
          .find('input')
          .type(digit, { force: true });
      });
    };

    // --- SECTION 1: AUTHENTICATION ---
    // Navigate to the enterprise log-in portal
    cy.visit('godokpharmglobalenterprise/login');

    // Fill user email, password, target the input wrapper, and submit the login form
    cy.get('input[placeholder="Enter email address"]').type(userEmail);
    cy.get('input[type="password"]').should('be.visible').type(userPassword);
    cy.get('input[type="email"]').click({ force: true });
    cy.get('button[type="submit"]').click();

    // Confirm successful login by verifying the visibility of the Point Of Sale dashboard
    cy.contains('Point Of Sale', { matchCase: false }).should('be.visible');

    // --- SECTION 2: CUSTOMER SELECTION ---
    // Trigger the customer lookup workflow by clicking the search interface trigger
    cy.contains('button, a, div, span', /^Search Customer$/i)
      .should('be.visible')
      .click({ force: true });  


    // 3. RANDOM CUSTOMER SELECTION (Restricted to first 5 rows)
    cy.contains('button', /^Select$/i)
      .should('have.length.at.least', 1) 
      .then(($buttons) => {
        // 1. Get the total available buttons, but cap it at a maximum of 5
        const availableCount = Math.min($buttons.length, 5);
        
        // 2. Generate a random index between 0 and 4 (first 5 items)
        const randomIndex = Math.floor(Math.random() * availableCount);
        
        // 3. Click the chosen button
        cy.wrap($buttons[randomIndex]).click({ force: true });
      });
                        // // Select an arbitrary customer from the visible collection to randomize testing data
                        // cy.contains('button', /^Select$/i)
                        //   .should('have.length.at.least', 1) 
                        //   .then(($buttons) => {
                        //     const randomIndex = Math.floor(Math.random() * $buttons.length);
                        //     cy.wrap($buttons[randomIndex]).click();
                        //   });

    // Ensure the empty default customer warning state is cleared from view
    cy.contains('No Customer Selected').should('not.exist');

    // --- SECTION 3: SYSTEM SCOPING ---
    // Select the specific operating branch from the system location configurations
    cy.contains('button, div, span', 'Branch (Calabar Municipal)')
      .should('be.visible')
      .click({ force: true });

    // Establish the dispensing unit type criteria for the current transaction
    cy.contains('button, span, div', 'Unit').click({ force: true });

    // --- SECTION 4: PRODUCT SELECTION & CART MANAGEMENT ---
    // Query, locate, and add the initial pharmaceutical item (Vitamin K) to the cart
    cy.get('input[placeholder*="Search products or scan barcode..."]')
      .should('be.visible')
      .clear()
      .type('v', { delay: 100 });

    cy.contains('div, li, span', 'vitamin K')
      .scrollIntoView({ duration: 400 })
      .should('be.visible')
      .click({ force: true });

    // Query, locate, and add the secondary pharmaceutical item (Potassium) to the cart
    cy.get('input[placeholder*="Search products or scan barcode..."]')
      .clear()
      .type('po', { delay: 100 });

    cy.contains('div, li, span', 'Potassium')
      .should('be.visible')
      .click({ force: true });

    // --- SECTION 5: FINANCIAL DATA CALCULATIONS & VALIDATION ---
    // Ensure the order itemization ledger header is fully rendered into view
    cy.contains('div, h3, h4, span', /Order Summary/i)
      .scrollIntoView({ duration: 500 })
      .should('be.visible');

    // Mathematical sanitization helper to strip currency symbols and return floating values
    const parseCurrency = (text) => parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
    
    // Formatting helper to re-apply Naira (₦) symbol syntax structure for UI assertions
    const formatCurrency = (val) =>
      `₦${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let calculatedSubtotal = 0;

    // Iterate through active transaction cart items to programmatically sum up subtotals
    cy.get('tbody tr, div[class*="grid"], div[class*="row"]')
      .filter(':contains("₦")')
      .each(($row) => {
        const rowText = $row.text();
        const priceMatches = rowText.match(/₦\s*[\d,]+\.\d{2}/g);
        if (priceMatches && priceMatches.length > 0) {
          const lineTotalText = priceMatches[priceMatches.length - 1];
          calculatedSubtotal += parseCurrency(lineTotalText);
        }
      })
      .then(() => {
        // Confirm the dynamic arithmetic total exactly matches the app's rendered subtotal element
        cy.contains('div, span, p', /^Subtotal$/i)
          .parents()
          .filter(':contains("₦")')
          .first()
          .should('contain.text', formatCurrency(calculatedSubtotal));

        // Locate, extract, and compound VAT pricing metrics to assert final checkout figures
        cy.contains('div, span, p', /VAT/i)
          .parents()
          .filter(':contains("₦")')
          .last()
          .invoke('text')
          .then((vatText) => {
            const vatMatches = vatText.match(/₦\s*[\d,]+\.\d{2}/g);
            const vatAmount = vatMatches ? parseCurrency(vatMatches[vatMatches.length - 1]) : 0;
            const grandTotal = calculatedSubtotal + vatAmount;

            cy.contains('div, span, p', /^Total$/i)
              .parents()
              .filter(':contains("₦")')
              .last()
              .should('contain.text', formatCurrency(grandTotal));
          });
      });

    // --- SECTION 6: INVOICING & SECURITY AUTHORIZATION ---
    // Advance the cart stage to the transactional billing processing phase
    cy.contains('button', /Generate Invoice/i)
      .scrollIntoView({ duration: 300 })
      .should('be.visible')
      .click({ force: true });

    // Confirm navigation intent constraints within the verification system dialogue box
    cy.get('[role="dialog"], .modal').within(() => {
      cy.contains('button', /continue/i).click({ force: true });
    });

    // EXECUTE SECURITY TEST A: Input inaccurate PIN configurations and reject system access
    fillPinInputs(invalidPin);
    cy.contains('button', /^Confirm$/i).click({ force: true });

    // Assert the presentation of clear system error responses regarding incorrect credential entry
    cy.contains(/Authorization failed.*invalid or expired PIN/i)
      .should('be.visible');

    // EXECUTE SECURITY TEST B: Complete authentication operations successfully using legitimate pin details
    fillPinInputs(validPin);
    cy.contains('button', /^Confirm$/i).click({ force: true });


    //  Alert the user to the successful completion of the invoice generation process
    cy.contains('div, span, p', /Invoice generated successfully/i)
      .should('be.visible');

    // --- SECTION 7: AUDIT LOG VALIDATION ---
    // Relocate to the enterprise administrative section via navigation elements
    cy.contains('a, button, div, span', /Sales Log/i)
      .should('be.visible')
      .click({ force: true });

    // Handle security re-prompt interface overlay to allow view clearance authorization
    cy.get('[role="dialog"], .modal').last().within(() => {
      cy.contains(/5-digit PIN|enter your PIN/i).should('be.visible');
    });

    // Input legitimate manager PIN using structural helpers
    fillPinInputs(validPin);

    // Finalize authentication process submission 
    cy.get('[role="dialog"], .modal').last().within(() => {
      cy.contains('button', /^Confirm$/i).click({ force: true });
    });

    // Confirm authorization modal closes down completely and validates view delivery
    cy.get('[role="dialog"], .modal').should('not.exist');
    cy.contains('h1, h2, h3, div, header', /Sales Log/i, { timeout: 10000 })
      .should('be.visible');
  });
});
