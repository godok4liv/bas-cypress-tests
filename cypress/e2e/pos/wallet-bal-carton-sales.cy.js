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


    // 1. Target the full row element block containing John Doe
    cy.contains('div, tr', 'John Doe')
      .closest('tr, div.flex, div.grid') // Travels up to capture the full row container
      .scrollIntoView()
      .within(() => {
        // 2. Now Cypress can cleanly scan the whole row for the Select text button
        cy.contains('Select')
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




            // 1. Isolate and parse the Subtotal value string
            // cy.contains('div, span, p', /^Subtotal/i).closest('div.flex').then(($sub) => {
            //   // Grab text, extract digits/decimal points, and parse
            //   const subtotal = parseFloat($sub.text().replace(/[^0-9.]/g, ''));

            //   // 2. Isolate and parse the VAT value string securely
            //   cy.contains('div, span, p', /^VAT/i).closest('div.flex').then(($vat) => {
            //     // CRITICAL FIX: Find the element containing the actual price sign to bypass label percentages
            //     const vatText = $vat.find(':contains("₦")').last().text() || $vat.text().split(')').pop();
            //     const vat = parseFloat(vatText.replace(/[^0-9.]/g, ''));

            //     // 3. Isolate and parse the Total value string inside the summary card block
            //     cy.contains('h3, h2, div, p', /Order Summary/i)
            //       .parent()
            //       .contains('div, span, p', /^Total$/i)
            //       .closest('div.flex')
            //       .then(($tot) => {
            //         const total = parseFloat($tot.text().replace(/[^0-9.]/g, ''));

            //         // Final calculation assertion step
            //         const expectedTotal = subtotal + vat;

            //         cy.log(`Fixed Calculation check: ${subtotal} (Subtotal) + ${vat} (VAT) = ${expectedTotal}`);
            //         expect(total).to.equal(expectedTotal);
            //       });
            //   });
            // });



//             // 1. Extract the transaction Total amount due
// cy.contains('div, p, span', /^Total$/i)
//   .closest('div.flex')
//   .find(':contains("₦")')
//   .last()
//   .then(($tot) => {
//     const totalOrderAmount = parseFloat($tot.text().replace(/[^0-9.]/g, ''));
//     cy.log(`Total Order Amount Due: **₦${totalOrderAmount}**`);

//     // 2. Extract the Available Wallet Balance
//     cy.contains('div, p, span', /Available Balance/i)
//       .closest('div')
//       .parent()
//       .find(':contains("₦")')
//       .last()
//       .then(($bal) => {
//         const walletBalance = parseFloat($bal.text().replace(/[^0-9.]/g, ''));
//         cy.log(`Customer Available Wallet Balance: **₦${walletBalance}**`);

//         // 3. Conditional Step Execution Based on Balance Coverage
//         if (walletBalance >= totalOrderAmount) {
//           cy.log('Wallet balance is sufficient! Proceeding with wallet checkout.');
          
//           // Click the green "Use Wallet Balance" button option
//           cy.contains('div, button', /Use Wallet Balance/i).click({ force: true });
//         } else {
//           cy.log('WARNING: Wallet balance is insufficient. Falling back to Cash payment.');
          
//           // Fallback option: Click the teal "Pay With Cash" button option
//           cy.contains('div, button', /Pay With Cash/i).click({ force: true });
//         }
//       });
//   });



// Click the green "Use Wallet Balance" button option
       cy.contains('div, button', /Use Wallet Balance/i).click({ force: true });









          });
      });






  });
});