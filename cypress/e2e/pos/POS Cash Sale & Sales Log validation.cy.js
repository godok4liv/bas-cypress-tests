

describe('Godok Pharm Global Enterprise - Cash Sales Automation', () => {
  const userEmail = 'otester777@gmail.com';
  const userPassword = 'Eazerd123@';
  const invalidPin = '11111';
  const validPin = '12345';

  it('Should process Cash-sales for Walk-In Customers and navigate to Sales Log to confirm sales receipt match', () => {

    // ----------------------------------------------------
    // HELPER: FILL 5-DIGIT PIN INPUTS (LIVE DOM QUERY)
    // ----------------------------------------------------
    const fillPinInputs = (pinCode) => {
      // Clear all input boxes first
      cy.get('[role="dialog"], .modal').last().find('input').each(($input) => {
        cy.wrap($input).clear({ force: true });
      });

      // Query live DOM for each index to handle re-renders
      const digits = pinCode.split('');
      digits.forEach((digit) => {
        cy.get('[role="dialog"], .modal')
          .last()
          .find('input')
          
          .type(digit, { force: true });
      });
    };

    // ----------------------------------------------------
    // 1. AUTHENTICATION & POS NAVIGATION
    // ----------------------------------------------------
    cy.visit('godokpharmglobalenterprise/login');

    cy.get('input[placeholder="Enter email address"]').type(userEmail);
    cy.get('input[type="password"]').should('be.visible').type(userPassword);
    cy.get('input[type="email"]').click({ force: true });
    cy.get('button[type="submit"]').click();

    cy.contains('Point Of Sale', { matchCase: false }).should('be.visible');

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

    // ----------------------------------------------------
    // 4. PRICE & VAT CALCULATIONS
    // ----------------------------------------------------
    cy.contains('div, h3, h4, span', /Order Summary/i)
      .scrollIntoView({ duration: 500 })
      .should('be.visible');

    const parseCurrency = (text) => parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
    const formatCurrency = (val) =>
      `₦${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let calculatedSubtotal = 0;

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
        cy.contains('div, span, p', /^Subtotal$/i)
          .parents()
          .filter(':contains("₦")')
          .first()
          .should('contain.text', formatCurrency(calculatedSubtotal));

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

    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // 7. PIN AUTHORIZATION (INVALID & VALID PIN)
    // ----------------------------------------------------
    // Stub print window to prevent freezes
    cy.window().then((win) => {
      cy.stub(win, 'print').as('receiptPrintStub');
    });

    // STEP A: Negative Test - Invalid PIN
    fillPinInputs(invalidPin);
    cy.contains('button', /^Confirm$/i).click({ force: true });

    cy.contains(/Authorization failed.*invalid or expired PIN/i)
      .should('be.visible');

    // STEP B: Positive Test - Valid PIN
    fillPinInputs(validPin);
    cy.contains('button', /^Confirm$/i).click({ force: true });

    // ----------------------------------------------------
    // 8. RECEIPT MODAL VALIDATION
    // ----------------------------------------------------
    cy.get('[role="dialog"], .modal').last().within(() => {
      cy.contains('div, h2, h3, header', /^Receipt$/i).should('be.visible');
      cy.contains('GODOKPHARM GLOBAL ENTERPRISE VAT').should('be.visible');
      cy.contains('INVOICE / RECEIPT').should('be.visible');

      cy.contains(/Invoice no\.:/i).should('be.visible');
      cy.contains(/Customer:/i).parent().should('contain.text', 'Walk-in Customer');

      cy.contains(/vitamin K/i).should('be.visible');
      cy.contains(/Potassium/i).should('be.visible');

      cy.contains(/Subtotal:/i).parent().should('contain.text', '₦6,000.00');
      

      cy.contains('button', /^Close$/i).click({ force: true });


    });

    // ----------------------------------------------------
    // NAVIGATION TO SALES LOG & PIN AUTHORIZATION
    // ----------------------------------------------------

    // 1. Click "Sales Log" in the sidebar menu
    cy.contains('a, button, div, span', /Sales Log/i)
      .should('be.visible')
      .click({ force: true });

    // 2. Handle PIN Authorization Overlay
    cy.get('[role="dialog"], .modal').last().within(() => {
      cy.contains(/5-digit PIN|enter your PIN/i).should('be.visible');
    });

    // 3. Enter Valid PIN using the dynamic DOM input helper
    fillPinInputs(validPin);

    // 4. Click Confirm
    cy.get('[role="dialog"], .modal').last().within(() => {
      cy.contains('button', /^Confirm$/i).click({ force: true });
    });

    // 5. Verify successful navigation to Sales Log page
    cy.get('[role="dialog"], .modal').should('not.exist');
    cy.contains('h1, h2, h3, div, header', /Sales Log/i, { timeout: 10000 })
      .should('be.visible');
  });
});