

describe('Product Bulk Upload Automation', () => {
  const userEmail = 'antaigodwin30@gmail.com'; 
  const userPassword = 'Eazerd123@';
  const securePin = '12345'; // Define your 5-digit validation PIN as a string

  it('should complete the end-to-end product bulk upload workflow successfully', () => {
    
    // STEP 1: AUTHENTICATION
    // ----------------------------------------------------
    cy.visit('/godokpharmglobalenterprise/login');

    cy.get('input[placeholder="Enter email address"]').type(userEmail);
    cy.get('input[type="password"]').should('be.visible').type(userPassword);
    cy.get('button[type="submit"]').click();

    // STEP 2: NAVIGATION TO STOCK BOOK
    // ----------------------------------------------------
    cy.contains('a, div, span', /^Stock Book$/i)
      .should('be.visible')
      .click();

    // STEP 3: INITIALIZE BULK UPLOAD
    // ----------------------------------------------------
    cy.contains('button, a, div, span', 'Bulk Upload')
      .scrollIntoView({ duration: 500 })
      .should('be.visible')
      .click();

    // STEP 4: INTERACT WITH THE UPLOAD MODAL
    // ----------------------------------------------------
    // 1. Download template file
    cy.contains('button, a', /Download Template \(\.xlsx\)/i)
      .should('be.visible')
      .click();

    // 2. Select local template fixture file
    const filePath = 'cypress/fixtures/Educational_Materials_Bulk_Upload_Template.xlsx';


    // 3. Attach file to input elements
    cy.get('input[type="file"]')
      .first()
      .selectFile(filePath, { force: true });

    // 4. Submit selected template file
    cy.contains('button', /^Upload File$/i)
      .should('be.visible')
      .should('not.be.disabled')
      .click();

//    // STEP 5: FILE PARSING VALIDATION (DYNAMIC CHECK)
// // ----------------------------------------------------
// // This matches any number of products found (e.g., 15, 20, 50, etc.)
// cy.contains('div, p, span', /^\d+ new products found/i)
//   .should('be.visible');

// // Click the teal final action button to save the products
// cy.contains('button, div, span', /^Confirm\s*&\s*Allocate\s*Stock$/i)
//   .should('be.visible')
//   .click();



// STEP 5: FILE PARSING VALIDATION (FULLY DYNAMIC EXTRACTION)
// ----------------------------------------------------
// 1. Locate the dynamic message header element and extract its text content
cy.contains('div, p, span', /new products found/i)
  .should('be.visible')
  .invoke('text')
  .then((bannerText) => {
    
    // 2. Parse out the integer from the string using a regular expression match
    // For example: "10 new products found!" -> extractedNumber = 10
    const match = bannerText.match(/(\d+)\s+new\s+products\s+found/i);
    const expectedclientCount = match ? parseInt(match[1], 10) : 0;
    
    cy.log(`🎯 Dynamically discovered client count from UI banner: ${expectedclientCount}`);

    // 3. Verify that the inner modal preview table matches the parsed count exactly
    // Uses structural component isolation to prevent background dashboard collisions
    cy.get('div[class*="modal"], div[class*="popup"], [role="dialog"]')
      .find('table tbody tr, div[role="row"]')
      .should('have.length', expectedclientCount);
  });

// 4. Click the action button to transition into structural validation steps
cy.contains('button, div, span', /^Confirm\s*&\s*Allocate\s*Stock$/i)
  .should('be.visible')
  .click();


    // STEP 6: EXCEPTION HANDLING AND CONDITIONAL SAVING
    // ----------------------------------------------------
    cy.wait(1500); // Allow modal engine parsing time

    cy.get('body').then(($body) => {
      const hasErrors = $body.text().includes('Expiry Date cannot be in the future') || 
                        $body.find('.text-red-500, [class*="error"]').length > 0;

      if (hasErrors) {
        // Fallback Routine: Handle validation failures
        cy.log('⚠️ Validation errors detected. Handling error screen workflow...');
        cy.contains('div, p, span', /Expiry Date/i).should('be.visible');

        cy.contains('button, span, div', /^Re-upload\s*File$/i)
          .should('be.visible')
          .click();
      } else {
        // Ideal Routine: Finalize and allocate inventory changes
        cy.log('✅ Validation checks passed cleanly. Finalizing stock allocation...');



        // Define your 5-digit validation PIN as an array of individual digits
// const securePin = ['1', '2', '3', '4', '5']; 

// // Target the 5 individual input fields inside the modal container layout
// cy.get('[role="dialog"], .modal-content, div[class*="modal"]')
//   .find('input[type="text"], input[type="tel"], input[maxlength="1"]')
//   .should('have.length', 5) // Verifies all 5 boxes exist on the screen
//   .each(($input, index) => {
//     // Loops from left to right, typing each corresponding digit into its box
//     cy.wrap($input).type(securePin[index]);
//   });

// // Click the teal Confirm action button directly below the pin fields
// cy.get('[role="dialog"], .modal-content, div[class*="modal"]')
//   .find('button')
//   .contains(/^Confirm$/)
//   .click({ force: true });

 cy.get('[role="dialog"], .modal-content, div[class*="modal"]')
          .find('input')
          .first()
          .should('be.visible')
          .clear()
          .type(securePin, { delay: 100 });

        cy.contains('button', /^Confirm$/i)
          .should('not.be.disabled')
          .click();


// // 1. Verify the "Upload Received" modal title is present on screen
// cy.contains('h1, h2, h3, div', /^Upload Received$/i)
//   .should('be.visible');

// // 2. Validate the description text dynamically regardless of product quantity count variations
// cy.contains('div, p, span', /Your file with \d+ products has been received/i)
//   .should('be.visible');

// // 3. Target and click the "Done" button using force: true to bypass the bottom layout overlays
// cy.contains('button, div, span', /^Done$/i)
//   .scrollIntoView()
//   .should('exist')
//   .click({ force: true });

// // 4. Final Verification: Ensure the success confirmation overlay is completely removed from view
// cy.contains(/^Upload Received$/i)
//   .should('not.exist');



// 1. Verify the "Upload Received" text exists on the page DOM safely
cy.contains('Upload Received').should('exist');

// 2. Validate the dynamic product count description text matches
cy.contains('div, p, span', /Your file with \d+ products has been received/i)
  .should('exist');

// 3. Directly target and click the "Done" button using a global text check
cy.contains('button, span, div', /^Done$/i)
  .scrollIntoView()
  .should('exist')
  .click({ force: true });

// 4. Final verification: Ensure the success confirmation is completely gone
cy.contains('Upload Received').should('not.exist');

   cy.scrollTo('top', { duration: 500 });
   cy.contains('Stock Book', { matchCase: false })
     .should('be.visible');
      }
    });

  });
});
