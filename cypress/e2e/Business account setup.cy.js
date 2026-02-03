describe('BAS Registration Flow', () => {
  it('should complete the business setup form', () => {
    // 1. Navigate from Login to Sign Up
    cy.visit('https://qa.bas.ng');

    cy.contains('Start Here', { matchCase: false }).click();

    // 2. Assert we are on the Setup page
    cy.contains('h1', "Let's Setup Your Account").should('be.visible');

    // 3. Fill in User Details
    cy.get('input[placeholder*="first name"]').type('Godwin');
    cy.get('input[placeholder*="last name"]').type('Edet');
    cy.get('input[placeholder*="email address"]').type('godwin.edet@example.com');

    // 4. Fill in Business Details
    cy.get('input[placeholder*="business name"]').type('Ikotun Pharmacy');
    
    // 5. Handle the Business Type Dropdown (Radix/Select component)
    cy.contains('Select business type').click();
    // Select an option from the resulting portal menu
    cy.get('[role="option"]').first().click(); 

    // 6. Security Fields
    cy.get('input[placeholder="Enter password"]').first().type('StrongPass123!');

    // Target the second password input field on the page
     cy.get('input[type="password"]').eq(1).type('StrongPass123!');


     // 1. Prepare your logo file in the 'cypress/fixtures' folder (e.g., logo.png)
     // 2. Target the upload input
    // Most 'Choose file' triggers are linked to a hidden input[type="file"]
  cy.get('input[type="file"]').selectFile('cypress/fixtures/logo.png', { force: true });
  

// 3. Alternatively, if you want to simulate a drag-and-drop onto the zone
//cy.get('div').contains('Drag and Drop file here')
  //.selectFile('cypress/fixtures/logo.png', { action: 'drag-drop' });

// 4. Final step: Click Save & Continue
cy.contains('button', 'Save & Continue')
  .click({ force: true });
   

    // 7. Submit the Form
    cy.contains('button', 'Save & Continue')
      .should('be.visible')
      .click({ force: true });
  });
});