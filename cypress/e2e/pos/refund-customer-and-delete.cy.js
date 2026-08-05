describe('Refund Customer and Delete Sales Receipt', () => { 

// Define credentials and configuration states for the automation lifecycle
  const userEmail = 'otester777@gmail.com';
  const userPassword = 'Eazerd123@';
  const validPin = '12345';


    it('should successfully refund a customer and delete the sales receipt', () => {

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





        // Navigate to the POS page
        cy.visit('/godokpharmglobalenterprise/login');

            // Populate operational administrative email and security credentials
        cy.get('input[placeholder="Enter email address"]').type(userEmail);
        cy.get('input[type="password"]').should('be.visible').type(userPassword);
        cy.get('button[type="submit"]').click();

        cy.wait(10000); // Wait for login processing 


        // Verify dashboard content
        cy.url().should('include', '/dashboard?feature=pos');
        cy.contains('Point Of Sale', { matchCase: false }).should('be.visible');
        // Verify dashboard content
        cy.url().should('include', '/dashboard?feature=pos');
        cy.contains('Point Of Sale', { matchCase: false }).should('be.visible');

        // Navigate to the Sales Log page
        cy.contains('button, a, div, span', 'Sales Log').should('be.visible').click({ force: true }); 
        cy.wait(5000); // Wait for navigation to Sales Log page  

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