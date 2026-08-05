describe('Godok Pharm Global Enterprise - Sales Automation', () => {
  // Define credentials and configuration states for the automation lifecycle
  const userEmail = 'otester777@gmail.com'; 
  const userPassword = 'Eazerd123@';

  it('Should process sales for Walk-In and Searched Customers at Branch 1', () => {
    
    // --- SECTION 1: SYSTEM VISITATION & LOG-IN ---
    // Navigate to the enterprise login portal
    cy.visit('godokpharmglobalenterprise/login');

    // Populate operational administrative email and security credentials
    cy.get('input[placeholder="Enter email address"]').type(userEmail);
    cy.get('input[type="password"]').should('be.visible').type(userPassword);
    cy.get('button[type="submit"]').click();

    // Verify dashboard system entry point confirmation
    cy.contains('Point Of Sale', { matchCase: false }).should('be.visible');

    // --- SECTION 2: OPERATIONAL DIVISION DEFINITION ---
    // Scope activities to the specific geographical enterprise branch
    cy.contains('button, div, span', 'Branch (Calabar Municipal)')
      .should('be.visible')
      .click({ force: true });

    // Designate dispensing inventory classification unit
    cy.contains('button, span, div', 'Unit').click({ force: true });

    // --- SECTION 3: INVENTORY DISCOVERY & CART ADDITION ---
    // Initial dummy interaction to activate or clear search bar state
    cy.get('input[placeholder*="Search products or scan barcode..."]')
      .should('be.visible')
      .type('a', { delay: 100 });

    // Look up and select the initial pharmaceutical asset (Vitamin K)
    cy.get('input[placeholder*="Search products or scan barcode..."]')
      .should('be.visible')
      .clear()
      .type('v', { delay: 100 });

    cy.contains('div, li, span', 'vitamin K').scrollIntoView({ duration: 400 }) 
      .should('be.visible')
      .click({ force: true });

    // Look up and select the secondary pharmaceutical asset (Potassium)
    cy.get('input[placeholder*="Search products or scan barcode..."]')
      .clear()
      .type('po', { delay: 100 });

    cy.contains('div, li, span', 'Potassium')
      .should('be.visible')
      .click({ force: true });

    // --- SECTION 4: FINANCIAL ACCOUNTING CALCULATIONS ---
    // Navigate focus down to view structural transaction ledger pricing information
    cy.contains('div, h3, h4, span', /Order Summary/i)
      .scrollIntoView({ duration: 500 })
      .should('be.visible');

    cy.contains('div, h3, h4, span', /Order Summary/i)
      .scrollIntoView({ duration: 500 })
      .should('be.visible');

    /**
     * Helper Function: parseCurrency
     * Extracts raw floating-point numbers from standard currency-formatted string displays.
     */
    const parseCurrency = (text) => parseFloat(text.replace(/[^0-9.]/g, '')) || 0;

    /**
     * Helper Function: formatCurrency
     * Converts numbers into localized Nigerian Naira (₦) structural UI syntax for matching.
     */
    const formatCurrency = (val) => `₦${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let calculatedSubtotal = 0;

    // Dynamically iterate over itemized line structures to compound subtotal pricing
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
        // Assert derived mathematical calculation matches app UI representation
        cy.contains('div, span, p', /^Subtotal$/i)
          .parents()
          .filter(':contains("₦")')
          .first()
          .should('contain.text', formatCurrency(calculatedSubtotal));

        // Evaluate VAT allocation rates and compound checkout targets
        cy.contains('div, span, p', /VAT/i)
          .parents()
          .filter(':contains("₦")')
          .last()
          .invoke('text')
          .then((vatText) => {
            const vatMatches = vatText.match(/₦\s*[\d,]+\.\d{2}/g);
            const vatAmount = vatMatches ? parseCurrency(vatMatches[vatMatches.length - 1]) : 0;
            const grandTotal = calculatedSubtotal + vatAmount;

            // Confirm calculated transaction grand total matches operational output summary view
            cy.contains('div, h3, h4, span', /Order Summary/i)
              .scrollIntoView({ duration: 500 })
              .should('be.visible')
              .filter(':contains("₦")')
              .last()
              .should('contain.text', formatCurrency(grandTotal));
          });
      });

    // --- SECTION 5: MODAL CANCELLATION VALIDATION ---
    // Trigger cash payment system routing actions to display execution modal overlay
    cy.contains('button', /Pay With Cash/i)
      .scrollIntoView({ duration: 300 })
      .should('be.visible')
      .click({ force: true });

    // Abort active transaction workflows intentionally inside the checkout dialog window context
    cy.get('[role="dialog"], .modal').within(() => {
      cy.contains('button', /Cancel/i).click({ force: true });
    });

    // Ensure the interface overlay view clears down completely from active framework tracking
    cy.get('[role="dialog"], .modal').should('not.exist');

    // Define security PIN configurations for verification tests
    const invalidPin = '11111'; 
    const validPin = '12345';   

    // --- SECTION 6: CASH PROCESSING ENTRY ---
    // Re-trigger cash gateway actions to re-open checkout operations
    cy.contains('button', /Pay With Cash/i)
      .scrollIntoView({ duration: 300 })
      .should('be.visible')
      .click({ force: true });

    // Handle structural ledger text properties to auto-populate balance values
    cy.get('[role="dialog"], .modal').within(() => {
      cy.contains('div, p, span', /Total Due/i)
        .parent()
        .invoke('text')
        .then((totalDueText) => {
          const amountToTender = parseFloat(totalDueText.replace(/[^0-9.]/g, '')) || 0;

          // Clear balance forms and write extracted operational figures
          cy.get('input[placeholder*="amount"]')
            .should('be.visible')
            .clear()
            .type(`${amountToTender}`);
        });

      // Submit input structures down into security challenge checkpoints
      cy.contains('button', /Process Sale & Print Receipt/i)
        .should('be.visible')
        .click({ force: true });
    });

    // --- SECTION 7: TWO-FACTOR IDENTITY CHALLENGES ---
    // Confirm target system modal interfaces require authorization verification
    cy.get('[role="dialog"], .modal').last().within(() => {
      cy.contains(/5-digit PIN/i).should('be.visible'); 

      // CRITERIA A: Invalidate transaction workflow using inaccurate credentials
      cy.get('input').each(($input, index) => {
        if (index < invalidPin.length) {
          cy.wrap($input).clear().type(invalidPin[index]);
        }
      });

      cy.contains('button', /^Confirm$/i).click({ force: true });

      // Verify rejection display notice configurations
      cy.contains(/Authorization failed.*invalid or expired PIN/i)
        .should('be.visible');

      // CRITERIA B: Input authentic verification codes to clear processing checkpoints
      cy.get('input').each(($input, index) => {
        if (index < validPin.length) {
          cy.wrap($input).clear().type(validPin[index]);
        }
      });
    });
  });
});
