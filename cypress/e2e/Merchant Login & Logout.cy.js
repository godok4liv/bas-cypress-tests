describe('owner login and logout workflow', () => {
  it('should log in with the Owner with valid existing business account & logout user successfully', () => {
    cy.visit('/');
    // Add your login test steps here

    // Targeting elements directly
    cy.get('input[type="email"]').type('Godok84liv@yahoo.com');
    cy.get('input[type="password"]').type('Eazerd123@');
    
    // Clicking the "Log In" button
    cy.get('button').contains('Log In').click();

    cy.wait(4000); // Wait for 3 seconds to allow for login processing

    // Assertion: Ensure we are in the system
    cy.url().should('include', '/dashboard');

    cy.wait(4000); // Wait for 4 seconds to allow dashboard to load
    cy.contains('Daily Digest').should('be.visible');
    cy.contains('All Branches').should('be.visible');

    cy.get('[data-slot="dropdown-menu-trigger"]').should('be.visible').click({multiple: true,force: true}); // Open user profile menu
    cy.wait(2000); // Wait for 2 seconds before logging out
  cy.contains('Logout').click({force: true}); // Click the "Log Out" button

        // Confirm logout in the dialog
  cy.get('div[role="dialog"]').should('be.visible').within(() => {
    cy.contains('Yes').click(); // Click "Yes" to confirm logout

    cy.wait(3000); // Wait for 2 seconds to allow for logout processing

    cy.url().should('eq', 'https://qaapp.bas.ng/'); // Verify we are back on the login page

       
    //cy.contains('button','Log In' ).should('be.disabled'); 
  
    


  });

  });
  

    

  
})
