describe('Godok Pharm Global Enterprise - POS/Transfer Sales Automation', () => {
  // Define credentials and configuration states for the automation lifecycle
  const userEmail = 'otester777@gmail.com';
  const userPassword = 'Eazerd123@';
  const invalidPin = '11111';
  const validPin = '12345';

  it('Should process POS sales for Walk-In Customers', () => {
    // Top-level variables to hold structural transactional data across async Cypress chains
    let dynamicSubtotal = 0;
    let dynamicVat = 0;
    let dynamicTotal = 0;

    /**
     * Helper Function: parseCurrency
     * Extracts raw floating-point numbers from standard currency-formatted string displays.
     */
    const parseCurrency = (text) => parseFloat(text.replace(/[^0-9.]/g, '')) || 0;

    /**
     * Helper Function: formatCurrency
     * Convers numbers into localized Nigerian Naira (₦) structural UI syntax for matching.
     */
    const formatCurrency = (val) =>
      `₦${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    /**
     * Helper Function: fillPinInputs
     * Discovers security dialogue inputs, clears old entries, and sequentially records a 5-digit verification PIN.
     */
    const fillPinInputs = (pinCode) => {
      // Find the active modal system view wrapper and clear existing structural inputs
      cy.get('[role="dialog"], .modal').last().find('input').each(($input) => {
        cy.wrap($input).clear({ force: true });
      });

      // Split strings to deliver characters individually into separate sequential input frames
      const digits = pinCode.split('');
      digits.forEach((digit) => {
        cy.get('[role="dialog"], .modal')
          .last()
          .find('input')
          .type(digit, { force: true });
      });
    };

    // --- SECTION 1: SYSTEM VISITATION & LOG-IN ---
    // Establish access with a browser window initialization stub to silence native print workflows
    cy.visit('godokpharmglobalenterprise/login', {
      onBeforeLoad(win) {
        cy.stub(win, 'print').as('receiptPrintStub');
      },
    });

    // Populate operational administrative email and security credentials
    cy.get('input[placeholder="Enter email address"]').type(userEmail);
    cy.get('input[type="password"]').should('be.visible').type(userPassword);
    cy.get('input[type="email"]').click({ force: true });
    cy.get('button[type="submit"]').click();

    // Verify dashboard system entry point confirmation
    cy.contains('Point Of Sale', { matchCase: false, timeout: 15000 }).should('be.visible');

    // --- SECTION 2: OPERATIONAL DIVISION DEFINITION ---
    // Scope activities to the specific geographical enterprise branch
    cy.contains('button, div, span', 'Branch (Calabar Municipal)')
      .should('be.visible')
      .click({ force: true });

    // Designate dispensing inventory classification unit
    cy.contains('button, span, div', 'Unit').click({ force: true });

    // --- SECTION 3: INVENTORY DISCOVERY & CART ADDITION ---
    // Look up and select the initial pharmaceutical asset (Vitamin K)
    cy.get('input[placeholder*="Search products or scan barcode..."]')
      .should('be.visible')
      .clear()
      .type('v', { delay: 100 });

    cy.contains('div, li, span', 'vitamin K')
      .scrollIntoView({ duration: 400 })
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

    // Dynamically iterate over itemized line structures to compound subtotal pricing
    cy.get('tbody tr, div[class*="grid"], div[class*="row"]')
      .filter(':contains("₦")')
      .each(($row) => {
        const rowText = $row.text();
        const priceMatches = rowText.match(/₦\s*[\d,]+(?:\.\d{2})?/g);
        if (priceMatches && priceMatches.length > 0) {
          const lineTotalText = priceMatches[priceMatches.length - 1];
          dynamicSubtotal += parseCurrency(lineTotalText);
        }
      })
      .then(() => {
        // Assert derived mathematical calculation matches app UI representation
        cy.contains('div, span, p, td', /^Subtotal$/i)
          .closest('tr, div')
          .should('contain.text', formatCurrency(dynamicSubtotal));

        // Evaluate VAT allocation rates or fall back to baseline 7.5 percent tax metrics
        cy.contains('div, span, p, td', /VAT/i)
          .closest('tr, div')
          .invoke('text')
          .then((vatText) => {
            const vatMatches = vatText.match(/₦\s*[\d,]+(?:\.\d{2})?/g);
            if (vatMatches && vatMatches.length > 0) {
              dynamicVat = parseCurrency(vatMatches[vatMatches.length - 1]);
            } else {
              dynamicVat = dynamicSubtotal * 0.075;
            }

            dynamicTotal = dynamicSubtotal + dynamicVat;
          });
      });

    // --- SECTION 5: CHANNEL BILLING METHOD SELECTION ---
    // Trigger POS routing actions on the dashboard interface
    cy.contains('button', /Pay With POS/i)
      .scrollIntoView({ duration: 300 })
      .should('be.visible')
      .click({ force: true });

    // Commit to processing billing activities within the contextual checkout dialogue modal
    cy.get('[role="dialog"], .modal').within(() => {
      cy.contains('button', /Process Sale & Print Receipt/i).click({ force: true });
    });

    // --- SECTION 6: TWO-FACTOR IDENTITY CHALLENGES ---
    // CRITERIA A: Invalidate transaction workflow using inaccurate credentials
    fillPinInputs(invalidPin);
    cy.contains('button', /^Confirm$/i).click({ force: true });

    // Verify rejection display notice configurations
    cy.contains(/Authorization failed.*invalid or expired PIN/i)
      .should('be.visible');

    // CRITERIA B: Complete validation cycles successfully via authentic verification codes
    fillPinInputs(validPin);
    cy.contains('button', /^Confirm$/i).click({ force: true });

    // --- SECTION 7: TRANSACTIONAL RECEIPT ACCOUNTABILITY ---
    // Inspect fields and properties on the delivered post-checkout customer invoice interface
    cy.get('[role="dialog"], .modal').last().within(() => {
      cy.contains('div, h2, h3, header', /^Receipt$/i).should('be.visible');
      cy.contains('GODOKPHARM GLOBAL ENTERPRISE VAT').should('be.visible');
      cy.contains('INVOICE / RECEIPT').should('be.visible');

      cy.contains(/Invoice no\.:/i).should('be.visible');
      cy.contains(/Customer:/i).parent().should('contain.text', 'Walk-in Customer');

      cy.contains(/vitamin K/i).should('be.visible');
      cy.contains(/Potassium/i).should('be.visible');

      // Match invoice summary lines against dynamically compounded transactional variables
      cy.then(() => {
        cy.contains(/Subtotal:/i).parent().should('contain.text', formatCurrency(dynamicSubtotal));
        cy.contains(/VAT\s*\(/i).parent().should('contain.text', formatCurrency(dynamicVat));
      });

      cy.contains(/Payment:/i).parent().should('contain.text', 'POS');

      // Terminate receipt view overlay tracking
      cy.contains('button', /^Close$/i).click({ force: true });
    });

    // --- SECTION 8: CENTRAL LEDGER HISTORICAL AUDITING ---
    // Route administration panel window parameters into the tracking log module
    cy.contains('a, button, div, span', /Sales Log/i)
      .should('be.visible')
      .click({ force: true });

    // Clear verification barrier challenges gating entry into structural financial history reports
    cy.get('[role="dialog"], .modal').last().within(() => {
      cy.contains(/5-digit PIN|enter your PIN/i).should('be.visible');
    });

    fillPinInputs(validPin);

    cy.get('[role="dialog"], .modal').last().within(() => {
      cy.contains('button', /^Confirm$/i).click({ force: true });
    });

    // Confirm total clearance of modals and successful redirection down into the administrative log
    cy.get('[role="dialog"], .modal').should('not.exist');
    cy.contains('h1, h2, h3, div, span', 'Sales History', { timeout: 10000 }).should('be.visible');

    // Confirm correct transactional line metrics exist within the primary layout history table
    cy.get('tbody tr', { timeout: 10000 }).first().within(() => {
      cy.contains('Walk-in Customer').should('be.visible');
      cy.contains('POS').should('be.visible');
      cy.contains('Paid').should('be.visible');

      cy.then(() => {
        cy.contains(formatCurrency(dynamicSubtotal)).should('be.visible');
      });
    });
  });
});
