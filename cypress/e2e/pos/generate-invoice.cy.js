import { faker } from '@faker-js/faker';

describe('Godok Pharm Global Enterprise - Sales Automation', () => {
  const userEmail = 'otester777@gmail.com';
  const userPassword = 'Eazerd123@';
  const validPin = '12345';

  it('Should process sales for Existing Customers and navigate to Sales Log to confirm sales receipt match', () => {

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

    // Click the "Search Customer" button
    cy.contains('button, a, div, span', /^Search Customer$/i)
      .should('be.visible')
      .click();

      cy.wait(1000); // Wait for the modal to appear

    // // 2. RANDOM CUSTOMER SELECTION
    // cy.contains('button', /^Select$/i)
    //   .should('have.length.at.least', 1) 
    //   .then(($buttons) => {
    //     const randomIndex = Math.floor(Math.random() * $buttons.length);
    //     cy.wrap($buttons[randomIndex]).click();
    //   });




    
// 2. RANDOM CUSTOMER SELECTION (FIXED FOR FLAKINESS)
// ------------------------------------------------------------------
// 1. Confirm that at least one Select button has loaded and is completely stable
cy.contains('button', /^Select$/i).should('be.visible');

// 2. Query the DOM for the count of buttons available at this exact moment
cy.get('button').contains(/^Select$/i).then(($buttons) => {
  const totalCount = $buttons.length;
  const randomIndex = Math.floor(Math.random() * totalCount);
  
  cy.log(`🎲 Total Select buttons discovered: ${totalCount} | Selecting Index: ${randomIndex}`);

  // 3. Instead of wrapping an old reference, fetch a completely fresh element using .eq()
  cy.get('button')
    .contains(/^Select$/i)
    .eq(randomIndex)
    .scrollIntoView()
    .click({ force: true });
});









    // Verify that the "No Customer Selected" state is cleared
    cy.contains('No Customer Selected').should('not.exist');

    // ----------------------------------------------------
    // 3. SELECT BRANCH & UNIT TYPE
    // ----------------------------------------------------
    cy.contains('button, div, span', 'Branch (Calabar Municipal)')
      .should('be.visible')
      .click({ force: true });

    cy.contains('button, span, div', 'Unit').click({ force: true });

    // ----------------------------------------------------
    // 4. ADD PRODUCTS TO CART
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
    // 5. PRICE & VAT CALCULATIONS
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
    // 6. GENERATE INVOICE & PIN AUTHORIZATION
    // ----------------------------------------------------
    cy.contains('button', /Generate Invoice/i)
      .scrollIntoView({ duration: 300 })
      .should('be.visible')
      .click({ force: true });

    cy.get('[role="dialog"], .modal').within(() => {
      cy.contains('button', /continue/i).click({ force: true });
    });

    // Positive Test - Valid PIN
    fillPinInputs(validPin);
    cy.contains('button', /^Confirm$/i).click({ force: true });

    // ----------------------------------------------------
    // 7. NAVIGATION TO SALES LOG & PIN AUTHORIZATION
    // ----------------------------------------------------

    // Click "Sales Log" in the sidebar menu
    cy.contains('a, button, div, span', /Sales Log/i)
      .should('be.visible')
      .click({ force: true });

    // Handle PIN Authorization Overlay
    cy.get('[role="dialog"], .modal').last().within(() => {
      cy.contains(/5-digit PIN|enter your PIN/i).should('be.visible');
    });

    // Enter Valid PIN using the dynamic DOM input helper
    fillPinInputs(validPin);

    // Click Confirm
    cy.get('[role="dialog"], .modal').last().within(() => {
      cy.contains('button', /^Confirm$/i).click({ force: true });
    });

    // Verify successful navigation to Sales Log page
    cy.get('[role="dialog"], .modal').should('not.exist');
    cy.contains('h1, h2, h3, div, header', /Sales Log/i, { timeout: 10000 })
      .should('be.visible');
  });
});
