import { faker } from '@faker-js/faker';

describe('BAS Signup Form', () => {
  it('should successfully fill out and submit the signup form,Navigate to Business Control and request account deletion', () => {
  

// 1. Generate dynamic data OUTSIDE the origin block
const userData = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  generatedEmail: faker.internet.email(),
  companyName: faker.company.name().replace(/[^a-zA-Z\s]/g, '').trim(),
  password : 'Password123!',
  // fileName :'logo.png',
  branchName : faker.company.name().replace(/,/g, '') + ' Branch',
  branchAddress : faker.location.streetAddress(),
  memberFirstName : faker.person.firstName(),
  memberLastName : faker.person.lastName(),
  memberEmail : faker.internet.email(),
  roleName: faker.person.jobTitle().replace(/[^a-zA-Z\s]/g, '').trim()
};




    // Visit the signup page
    cy.visit('https://qa.bas.ng/');

    // Targets the Sign Up button inside the navigation/header area
       cy.get('nav, header').contains('Pricing').click();

      // Finds the first card container or column and clicks its button
    cy.get('.pricing-card, div').contains('Choose To Pay').first().click();


// Wrap your code inside the active origin block
cy.origin('https://qaapp.bas.ng', { args: userData },({firstName,lastName,generatedEmail,companyName,password,memberEmail,memberFirstName,memberLastName,branchAddress,branchName,roleName}) => {

// Prevent app-level JavaScript crashes during file upload from failing the test
    Cypress.on('uncaught:exception', () => false);


    // Fill in basic user details
    cy.get('input[placeholder="Enter first name"]').type(firstName);
    cy.get('input[placeholder="Enter last name"]').type(lastName);
    cy.get('input[placeholder="Enter email address"]').type(generatedEmail);
    cy.get('input[placeholder="Enter business name"]').type(companyName);

    // Select Business Type from dropdown
    cy.contains('label, span', 'Business Type').parent().find('[role="combobox"], button, input').click();
    cy.contains('[role="option"]', 'Pharmacy', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });

    // Fill in Password fields
    cy.get('input[placeholder="Enter password"]').type(password);
    cy.get('input[type="password"]').last().type(password);

    // // Upload Logo
    // cy.get('input[type="file"]').selectFile(`cypress/fixtures/logo.png`, { force: true });

    // Accept Terms & Conditions
    cy.get('[role="checkbox"]').click();

    // Submit Form
    cy.contains('button, [role="button"]', 'Save & Continue').click();

    // Assert successful submission/navigation
    cy.url().should('include', '/signup');
    cy.contains(generatedEmail).should('be.visible');

    // Proceed past success page
    cy.get('button, a').contains('Continue').click();

    // Fill out Branch Name and Address
    cy.get('input[placeholder="Enter branch name"]').should('be.visible').type(branchName);
    cy.get('input[placeholder="Enter branch address"]').should('be.visible').type(branchAddress);
    cy.get('button').contains('Save & Continue').click();

    // Fill out Team Member details
    cy.get('input[placeholder="Enter first name"]').type(memberFirstName);
    cy.get('input[placeholder="Enter last name"]').type(memberLastName);
    cy.get('input[placeholder="Enter email address"]').type(memberEmail);


    // 1. Click "+ New role" to reveal the role input field
      cy.contains('button', '+ New role').should('be.visible').click();

      // 2. Locate the input field with the placeholder "e.g. Cashier" and type your new role
      cy.get('input[placeholder="e.g. Cashier"]').should('be.visible').type(roleName);

      // 3. Click the "Next: Set Permissions" button to proceed
      cy.get('button').contains('Next: Set Permissions').click();


              // 1. Validate the bold text (dynamic member name) matches what was generated
              // Using the memberFirstName and memberLastName from your userData object
              const fullMemberName = `${memberFirstName} ${memberLastName}`;
              cy.contains('p, span, div, h2', fullMemberName)
                .should('be.visible')
                .should('have.css', 'font-weight', '600'); // Validates that the text is bold (bold typically equals 700)

          

        // 2. Select Permissions by clicking the parent wrapper element directly
        // This avoids looking for hidden or non-standard nested inputs
        cy.contains('div', 'View Audit Log').closest('div').click({ force: true });
        cy.contains('div', 'View Branches').closest('div').click({ force: true });

       

    // Save Permissions
    cy.scrollTo('bottom');
    cy.get('button').contains('Save Permissions & Add New Staff', { matchCase: false }).click({ force: true });

    cy.wait(4000); // Wait for processing

    // Verify team member creation and go to Dashboard
    cy.contains(memberEmail).should('be.visible');
    cy.contains('button, a', 'Go To Dashboard').should('be.visible').click();

    // Login with the newly created credentials
    cy.get('input[placeholder="Enter email address"]').should('be.visible').type(generatedEmail);
    cy.get('input[type="password"]').should('be.visible').type(password);
    cy.contains('button', 'Log In').should('be.visible').click();

    // Verify dashboard content
    cy.url().should('include', '/dashboard');
    cy.contains('Daily Digest', { timeout: 10000 }).should('be.visible');

    // Navigate to Business Control page
    cy.contains('a, button, span', /Business\s*Control/i, { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.url().should('include', '/dashboard?feature=settings');

    // // Initiate Account Deletion
    // cy.scrollTo('bottom');
    // cy.get('button').contains(/Delete Account|Close Account|Delete Business/i).should('be.visible').click({ force: true });

    // // Confirm deletion in modal
    // cy.get('[role="dialog"], .modal').contains('button', /^Proceed$/).should('be.visible').click({ force: true });

    // cy.wait(1000); // Settle animation

    // Fill verification details
    // cy.get('[role="dialog"] input, .modal input, input[type="tel"]').first().type('12345', { force: true, delay: 100 });
    // cy.get('textarea[placeholder*="why you are leaving"]').should('be.visible').type('Automated testing account cleanup.');
    // cy.contains('button', /^Send verification code$/).should('be.visible').click({ force: true });

// 1. Open the dashboard switcher dropdown menu at the top
cy.get('button, div').contains(/Operations Dashboard/i).should('be.visible').click();

// 2. Select the "Sales Dashboard" (POS view) from the list
cy.get('[role="menuitem"], div, p').contains('Sales Dashboard').should('be.visible').click();





// 1. Open the "Select a branch" dropdown inside the modal
cy.get('[role="dialog"], .modal, div').contains('label', 'Branch')
  .parent()
  .find('[role="combobox"], button, input')
  .click({ force: true });

// 2. Select your dynamically generated branchName from the dropdown list
// (This references the branchName variable defined in your userData block)
cy.contains('[role="option"], div, span', branchName)
  .should('be.visible')
  .click({ force: true });

// 3. Click the confirmation button to enter the Point of Sale
cy.contains('button, [role="button"]', 'Continue to Point of Sale')
  .should('be.visible')
  .click({ force: true });

// 4. Assert that you have successfully bypassed the modal and are on the POS screen
cy.contains('Search Customer', { timeout: 10000 }).should('be.visible');












// 3. Confirm that you have successfully entered the Sales/POS view
// (Adjust the URL keyword or unique text element if your POS UI uses a different string)
cy.url().should('include', 'sales'); 
cy.get('body').should('be.visible'); // Simple safety check to ensure it settles

// 4. Open the switcher menu again to toggle back
cy.get('button, div').contains(/Sales Dashboard/i).should('be.visible').click();

// 5. Select "Operations Dashboard" to switch back to your management view
cy.get('[role="menuitem"], div, p').contains('Operations Dashboard').should('be.visible').click();

// 6. Confirm you are back in the operations/dashboard management panel
cy.url().should('include', '/dashboard');
cy.contains('Business Profile', { timeout: 10000 }).should('be.visible');




});


  });
});
