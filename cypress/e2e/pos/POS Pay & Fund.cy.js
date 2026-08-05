

 describe('Godok Pharm Global Enterprise - Sales Automation', () => {
  // Variables for login credentials
  const userEmail = 'otester777@gmail.com'; 
  const userPassword = 'Eazerd123@';

  it('Should process sales for Walk-In and Searched Customers at Branch 1', () => {
    
    // ----------------------------------------------------
    // 1. AUTHENTICATION & POS NAVIGATION
    // ----------------------------------------------------
    cy.visit('godokpharmglobalenterprise/login');

    cy.get('input[placeholder="Enter email address"]').type(userEmail);
    cy.get('input[type="password"]').should('be.visible').type(userPassword);

    // Bypass structural form bugs safely
    //cy.get('input[type="email"]').click({ force: true });

    // Submit credentials
    cy.get('button[type="submit"]').click();

    //cy.wait(7000); // Wait for 5 seconds to allow for login processing (to be removed later)

    // Confirm successful point of sale entry
    cy.contains('Point Of Sale', { matchCase: false }).should('be.visible');

    //cy.wait(7000); // Wait for 5 seconds to allow for login processing(to be removed later)


    // ----------------------------------------------------
    // 2. SELECT BRANCH 1 (Branch Calabar Municipal)
    // ----------------------------------------------------
    cy.contains('button, div, span', 'Branch (Calabar Municipal)')
      .should('be.visible')
      .click({ force: true });

    // Ensure "Unit" unit type is selected for adding to cart
    cy.contains('button, span, div', 'Unit').click({ force: true });

    // ====================================================
    // SCENARIO A: SALE TO WALK-IN CUSTOMER (DEFAULT)
    // ====================================================

    // 1. Search and add product to cart via barcode/name search bar
    cy.get('input[placeholder*="Search products or scan barcode..."]')
      .should('be.visible')
      .type('a', { delay: 100 });


// ADD 2 PRODUCTS TO CART
// ====================================================

// --- 1. Search & Select First Product (vitamin b12) ---
cy.get('input[placeholder*="Search products or scan barcode..."]')
  .should('be.visible')
  .clear()
  .type('v', { delay: 100 });

     // Click the first matching product row from the open dropdown
cy.contains('div, li, span', 'vitamin K').scrollIntoView({ duration: 400 }) 

  .should('be.visible')
  .click({ force: true });

     // --- 2. Search & Select Second Product (carton test) ---
cy.get('input[placeholder*="Search products or scan barcode..."]')
  .clear()
  .type('po', { delay: 100 });

// Click the second product row from the open dropdown
cy.contains('div, li, span', 'Potassium')
  .should('be.visible')
  .click({ force: true });








  // ----------------------------------------------------
    // DYNAMIC PRICE, VAT (7.5%), & TOTAL VALIDATION
    // ----------------------------------------------------

    // 1. Scroll down to the Order Summary section
    cy.contains('div, h3, h4, span', /Order Summary/i)
      .scrollIntoView({ duration: 500 })
      .should('be.visible');

    

// Helper functions for currency parsing & formatting
    // DYNAMIC PRICE, VAT (7.5%), & GRAND TOTAL VALIDATION
    // ----------------------------------------------------
    cy.contains('div, h3, h4, span', /Order Summary/i)
      .scrollIntoView({ duration: 500 })
      .should('be.visible');

    const parseCurrency = (text) => parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
    const formatCurrency = (val) => `₦${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let calculatedSubtotal = 0;

    // 1. Calculate Subtotal from item rows
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
        // 2. Assert Subtotal
        cy.contains('div, span, p', /^Subtotal$/i)
          .parents()
          .filter(':contains("₦")')
          .first()
          .should('contain.text', formatCurrency(calculatedSubtotal));

        // 3. Extract dynamic VAT and calculate Grand Total inside the same scope
        cy.contains('div, span, p', /VAT/i)
          .parents()
          .filter(':contains("₦")')
          .last()
          .invoke('text')
          .then((vatText) => {
            const vatMatches = vatText.match(/₦\s*[\d,]+\.\d{2}/g);
            const vatAmount = vatMatches ? parseCurrency(vatMatches[vatMatches.length - 1]) : 0;

            // Calculate Grand Total (Subtotal + Dynamic VAT)
            const grandTotal = calculatedSubtotal + vatAmount;


            // 4. Assert Grand Total (Inside closure to avoid ReferenceError)
            cy.contains('div, h3, h4, span', /Order Summary/i)
           .scrollIntoView({ duration: 500 })
             .should('be.visible')
              .filter(':contains("₦")')
                .last()
                 .should('contain.text', formatCurrency(grandTotal));


     cy.contains(/^Generate Invoice$/i).click({ force: true });







          });
      });
       

       // 1. Assert the red validation error alert is visible
    cy.contains('div, span, p', /Select a customer to generate an invoice/i)
      .should('be.visible');

      cy.scrollTo('top');

   // 2. Scroll back up to the "Search Customer" button and click it
     cy.contains('button, a, div, span', /^Search Customer$/i)
    .scrollIntoView()
    .should('be.visible')
    .click();
      

      
    // // 3. Target all green 'Select' buttons on the customer listing screen
    cy.contains('button', /^Select$/i)
      .should('have.length.at.least', 1) // Ensure the table has loaded data
      .then(($buttons) => {
        // Pick a random index based on the number of rows visible
        const randomIndex = Math.floor(Math.random() * $buttons.length);
        
        // Click the randomly chosen customer
        cy.wrap($buttons[randomIndex]).click();
      });

    // 4. Verify that the "No Customer Selected" state is cleared
    cy.contains('No Customer Selected').should('not.exist');

    // 5. Scroll back down to the payment section and click "Generate Invoice"
    cy.contains('button, div', /^Generate Invoice$/i)
      .scrollIntoView()
      .should('be.visible')
      .click();


      // 1. Assert that the "Generate invoice" modal pops up and displays the correct total
       cy.contains('h2, div, p', /^Generate invoice$/i).should('be.visible');
      cy.contains('div, p, span', '₦6,450.00').should('be.visible');

        // 2. Click the teal "Continue" button
        cy.contains('button, div, span', /^Continue$/i)
          .should('be.visible')
          .click();



          






                
              });
            }
          );

    
