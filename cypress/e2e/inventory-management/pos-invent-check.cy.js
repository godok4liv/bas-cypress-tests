describe('Sales Representative - POS Daily Inventory Verification Workflow', () => {
  const repEmail = 'otester777@gmail.com';
  const repPassword = 'Eazerd123@';
  const securityPin = '80888'; // Populated with your working verification PIN

  it('TC_001: Should login as sales rep, navigate to inventory checks, and dynamically handle the landing view', () => {
    
    // STEP 1: SALES REPRESENTATIVE AUTHENTICATION
    // ----------------------------------------------------
    cy.visit('/godokpharmglobalenterprise/login'); // Navigates to your platform login page
    
    cy.get('input[name="email"]').type(repEmail);
    cy.get('input[name="password"]').type(repPassword);
    cy.get('button[type="submit"]').click();

    // Confirm successful POS dashboard landing page entry
    cy.url().should('include', '/dashboard');

    // STEP 2: NAVIGATE TO INVENTORY CHECKS VIA SIDEBAR
    // ----------------------------------------------------
    cy.contains('a, span, div', /Inventory Checks/i)
      .should('be.visible')
      .click();
    
    cy.url().should('include', 'inventory');

    // STEP 3: TRANSACTIONAL SECURITY PIN AUTHORIZATION GATELINE
    // ----------------------------------------------------
     // Target the verified modal title "Daily Inventory Check" to confirm the screen mounted
      cy.contains('h2, h3, div, p', /^Daily Inventory Check$/i).should('be.visible');

    // Targets the single underlying master input box inside the security card layout container
    cy.get('[role="dialog"], .modal-content, .pin-container, div[class*="modal"]')
      .find('input')
      .first()
      .should('be.visible')
      .clear()
      .type(securityPin, { delay: 100 }); // Typing with a short delay ensures smooth digit distribution

    cy.contains('button', /^Confirm$/i)
      .should('not.be.disabled')
      .click();

    // STEP 4: DYNAMIC LANDING VIEW EVALUATION
    // ----------------------------------------------------
    cy.wait(2000); // Give the dashboard router window time to resolve backend stream requests

    cy.get('body').then(($body) => {
      
      // Look for signatures of the Admin Verification screen vs the Daily Check table view
      const isAdminVerificationScreen = $body.text().includes('Verify Admin') || 
                                         $body.text().includes('Waiting for Admin Approval');

      if (isAdminVerificationScreen) {
        // PATH A: ROUTED TO ADMIN VERIFICATION VIEW
        cy.log('🔒 Path A Detected: Directed to Admin Verification Screen.');
        
        // Assert elements relevant to structural admin validation tracking states are visible
        cy.contains('div, h2, p', /Verify Admin|Pending Approval/i)
          .should('be.visible');
          
      } else {
        // PATH B: ROUTED TO SYSTEM GENERATED DAILY CHECKS
        cy.log('📋 Path B Detected: Directed to System Generated Daily Checks Grid.');
        
        // Assert the tabular cycle count table or tracking headers load into view
        cy.contains('h1, h2, h3, div', /Daily Inventory Check/i)
          .should('be.visible');


// TARGET AND AUTOMATE THE VERIFY BUTTON IN THE DATA ROW (FIXED SELECTOR)
         // This selects the first available active operational Verify button on the page canvas directly
            cy.contains('button, span, div, a', /^Verify$/i)
              .first()
              .click({ force: true });

            // VALIDATE AND POPULATE PHYSICAL COUNT MODAL FIELDS
            // ------------------------------------------------------------------
            cy.get('[role="dialog"], .modal-content, div[class*="modal"]').should('exist');

            // 1. Enter the physical stock count observed on shelves
            cy.get('input[placeholder*="Physical Count On Shelve"]')
              .should('be.visible')
                .clear()
                .type('10', { delay: 100 });


            // Validate that the physical count modal or pop-up card forms appear on screen
            cy.get('[role="dialog"], .modal-content, div[class*="modal"]')
              .should('be.visible');






              // STEP 10: COMPLETE DUAL-LAYER DAILY INVENTORY VERIFICATION FORM




// 3. Populate operational validation tracking notes
cy.get('textarea[placeholder*="any remarks"]')
  .first()
  .should('be.visible')
  .clear()
  .type('Automated sales representative stock cross-validation complete.', { force: true });

// 4. Submit verification modifications to clear the product queue
cy.contains('button, span, div', /^Finalise Verification$/i)
  .should('be.visible')
  .click({ force: true });






      }
    });

  });
});
