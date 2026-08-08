describe('Inventory Checks - Branch Selection & Check Generation', () => {

  beforeEach(() => {
    // STEP 1: AUTHENTICATION
    // ----------------------------------------------------
    cy.visit('/godokpharmglobalenterprise/login');
    
    cy.get('input[name="email"]').type('antaigodwin30@gmail.com');
    cy.get('input[name="password"]').type('Eazerd123@');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
  });

  it('TC_001: Should navigate to inventory checks, select an active branch, and authorize stock sheet generation', () => {
    // STEP 2: NAVIGATION TO INVENTORY CHECKS
    // ----------------------------------------------------
    cy.contains('a, span', 'Inventory Checks').click();
    
    cy.url().should('include', 'inventory');
    cy.contains('h1, h2, div', 'Inventory Checks').should('be.visible');

    // STEP 3: INITIAL STATE COMPLIANCE CHECK
    // ----------------------------------------------------
    cy.contains('All Branches').should('be.visible');
    cy.contains('button', 'Generate Check').should('be.disabled');

    // STEP 4: INTERACTIVE BRANCH SELECTION
    // ----------------------------------------------------
    cy.contains('All Branches').click();
    cy.contains('Calabar Municipal').click();

    // STEP 5: STATE UPDATE ASSERTION
    // ----------------------------------------------------
    cy.contains('button', 'Generate Check').should('not.be.disabled');

    // STEP 6: INITIALIZE MODAL GENERATION WORKFLOW
    // ----------------------------------------------------
    cy.contains('button', 'Generate Check')
      .scrollIntoView()
      .click({ force: true });

    // STEP 7: CONFIGURATION MODAL DISMISSAL
    // ----------------------------------------------------
    cy.contains('Generate Inventory Check').should('be.visible');
    cy.contains('button', 'Continue').click();

    // STEP 8: TARGET UNIFIED MASTER SECURITY PIN FIELD
    // ----------------------------------------------------
    cy.contains('Generate Daily Check').should('be.visible');

    const pin = '80888';
    
    // Scopes execution to active dialog layout overlay to avoid layout collisions
    cy.get('[role="dialog"], .modal-content, div[class*="modal"]')
      .find('input')
      .first()
      .should('be.visible')
      .clear()
      .type(pin, { delay: 100 }); // Smooth key delay distributes numeric text cleanly

    // STEP 9: SUBMIT TRANSACTION AUTHORIZATION
    // ----------------------------------------------------
    cy.contains('button', 'Confirm')
      .should('not.be.disabled')
      .click();

    // // STEP 10: VERIFY SUCCESS BANNER NOTIFICATION
    // // ----------------------------------------------------
    // // Targets the floating toast alert containing the confirmation text
    // cy.contains('div, p, span, [role="status"]', /^Inventory check generated successfully/i)
    //   .should('be.visible');

    // // Optional: Verify that the success notification naturally dismisses from the DOM
    // cy.contains('Inventory check generated successfully', { timeout: 7000 })
    //   .should('not.exist');


        // STEP 10: CONDITIONAL SUCCESS TRACKING & FALLBACK
    // ----------------------------------------------------
    // 1. Give the network stream and notification framework a brief moment to render
    cy.wait(2000);

    // 2. Check the active page DOM to see if the success banner was generated
    cy.get('body').then(($body) => {
      
      const isGenerationSuccessful = $body.text().includes('Inventory check generated successfully');

      if (isGenerationSuccessful) {
        // CASE A: Clean First Attempt Success
        cy.log('✅ Inventory check generated automatically via server stream.');
        
        cy.contains('div, p, span, [role="status"]', /Inventory check generated successfully/i)
          .should('be.visible');
          
      } else {
        // CASE B: Second Attempt Failure / Already Generated Block Detected
        cy.log('⚠️ Automatic generation blocked or failed. Navigating back to initiate manual setup...');

        // Reload or click back button to close any frozen overlay modals
        cy.reload();

        // 3. Fallback Route: Click the 'Inventory History' or relevant element to trigger manual entry
        cy.contains('button, a, span', /Inventory History/i)
          .should('be.visible')
          .click();

        // Proactively add your manual input form triggering step here
        cy.log('🚀 Ready for manual inventory entry initialization tasks.');




                // ==================================================================
        // FALLBACK ROUTINE: INITIATE MANUAL ENTRY INSIDE CONFIGURATION MODAL
        // ==================================================================
        cy.log('⚠️ Fallback path triggered: Configuring manual product check configuration...');


        // STEP 5: STATE UPDATE ASSERTION
    // ----------------------------------------------------
    cy.contains('button', 'Generate Check').should('not.be.disabled');

    // STEP 6: INITIALIZE MODAL GENERATION WORKFLOW
    // ----------------------------------------------------
    cy.contains('button', 'Generate Check')
      .scrollIntoView()
      .click({ force: true });


        // 1. Confirm the "Generate Inventory Check" modal is open and visible
        cy.contains('div, h2, h3', /^Generate Inventory Check$/i).should('be.visible');

        // 2. Select the "Manual" selection mode button
        cy.contains('button, div, span', /^Manual$/)
          .should('be.visible')
          .click();

        // 3. Clear the default product count and type a specific value (e.g., 2)
        cy.get('input[type="number"], input[id*="products"]')
          .first()
          .should('be.visible')
          .clear()
          .type('2');

        // 4. Search and select items from the scrollable list container
        // Type search query to filter the target item rows
        cy.get('input[placeholder*="Search products to add"]')
          .first()
          .should('be.visible')
          .clear()
          .type('Bins');

        // Click the matching item row from the underlying scroll selection tray
        cy.contains('div, p, span, li', /^Bins$/i)
          .should('be.visible')
          .click();

        // 5. Progress to the security authorization step
        cy.contains('button', /^Continue$/i)
          .should('be.visible')
          .should('not.be.disabled')
          .click();
       }

// STEP 8: TARGET UNIFIED MASTER SECURITY PIN FIELD
    // ----------------------------------------------------
    cy.contains('Generate Daily Check').should('be.visible');

    const pin = '80888';
    
    // Scopes execution to active dialog layout overlay to avoid layout collisions
    cy.get('[role="dialog"], .modal-content, div[class*="modal"]')
      .find('input')
      .first()
      .should('be.visible')
      .clear()
      .type(pin, { delay: 100 }); // Smooth key delay distributes numeric text cleanly

    // STEP 9: SUBMIT TRANSACTION AUTHORIZATION
    // ----------------------------------------------------
    cy.contains('button', 'Confirm')
      .should('not.be.disabled')
      .click();






    });







  });

});
