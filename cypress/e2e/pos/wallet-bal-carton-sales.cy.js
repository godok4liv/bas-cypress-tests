import { faker } from "@faker-js/faker";

describe('should successfully complete wallet balance sales to customer', () => {

  it('should successfully complete wallet balance sales to existing client', () => {

    cy.visit('/godokpharmglobalenterprise/login');



    cy.get('input[placeholder="Enter email address"]').type('otester777@gmail.com');
    cy.get('input[type="password"]').should('be.visible').type('Eazerd123@');
    cy.get('button[type="submit"]').click();    

     cy.contains('Point Of Sale', { matchCase: false }).should('be.visible');





     // Click the "Search Customer" button
    cy.contains('button, a, div, span', /^Search Customer$/i)
      .should('be.visible')
      .click();

      cy.wait(1000); // Wait for the modal to appear



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


// ----------------------------------------------------
    // 3. SELECT BRANCH & UNIT TYPE
    // ----------------------------------------------------
    cy.contains('button, div, span', 'Branch (Calabar Municipal)')
      .should('be.visible')
      .click({ force: true });

    cy.contains('button, span, div', 'Carton').click({ force: true });

  // just to help pass carton sales test, we will add a product to cart and then proceed to checkout





    // ----------------------------------------------------
    // 4. ADD PRODUCTS TO CART
    // ----------------------------------------------------
    cy.get('input[placeholder*="Search products or scan barcode..."]')
      .should('be.visible')
      .clear()
      .type('v', { delay: 100 });

    cy.contains('div, li, span', 'vitamin b123')
      .scrollIntoView({ duration: 400 })
      .should('be.visible')
      .click({ force: true });

  

    cy.get('input[placeholder*="Search products or scan barcode..."]')
      .clear()
      .type('su', { delay: 100 });


    cy.contains('div, li, span', 'Sugar')
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






  });
});