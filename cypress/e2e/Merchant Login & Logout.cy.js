describe('owner login and logout workflow', () => {
  it('should log in with the Owner with valid existing business account & logout successfully', () => {
    cy.visit('regresssmartltd/');
    // Add your login test steps here
            cy.reload(true);

    // Targeting elements directly
    cy.get('input[type="email"]').type('breannehyland@streamingku.live');
    cy.get('input[type="password"]').type('Eazerd123@');


               // to click email input field to ensure it's focused before clicking the login button
               cy.get('input[type="email"]').click({ force: true });

    
    // Clicking the "Log In" button
         cy.contains('button', 'Log In').click();
         //cy.contains('button', 'Log In').click();
    //cy.get('button').contains('Log In').click({force: true});

    cy.wait(10000); // Wait for 3 seconds to allow for login processing

    // Assertion: Ensure we are in the system
    cy.url().should('include', '/dashboard');

    //cy.wait(4000); // Wait for 4 seconds to allow dashboard to load
    cy.contains('Daily Digest').should('be.visible');
    cy.contains('All Branches').should('be.visible');



    // Verify Owner Name (Image 11 & 12)
           // cy.contains(`${firstName} ${lastName}`).should('be.visible');  
          cy.contains('OWNER').should('be.visible');


    cy.get('[data-slot="dropdown-menu-trigger"]').should('be.visible').click({multiple: true,force: true}); // Open user profile menu
    //cy.wait(2000); // Wait for 2 seconds before logging out
  cy.contains('Logout').click({force: true}); // Click the "Log Out" button

        // Confirm logout in the dialog
  cy.get('div[role="dialog"]').should('be.visible').within(() => {
    cy.contains('Yes').click(); // Click "Yes" to confirm logout

    cy.wait(5000); // Wait for 2 seconds to allow for logout processing

    cy.url().should('eq', 'https://qaapp.bas.ng/regresssmartltd/login'); // Verify we are back on the login page
    
    
    //cy.contains('Enter your Account', { matchCase: false }).should('be.visible'); // Verify the text visible on the login page

         // Finds the heading tag containing the text and checks if it's visible
    cy.get('h1, h2, h3')
        c.contains('Enter your Account')
        .should('be.visible');
   
    

          
     
     
});


      
   
    });
  
    


  });

  
  

    

  

