import { faker } from '@faker-js/faker';

describe('BAS Signup Form', () => {
  it('should successfully fill out and submit the signup form,Navigate to Business Control and request account deletion', () => {
    // Generate dynamic values
    // const generatedEmail = faker.internet.email();
    // const companyName = faker.company.name().replace(/[^a-zA-Z\s]/g, '').trim();
    // const password = 'Password123!';
    // const fileName = 'logo.png';
    // const branchName = faker.company.name().replace(/,/g, '') + ' Branch';
    // const branchAddress = faker.location.streetAddress();
    // const memberFirstName = faker.person.firstName();
    // const memberLastName = faker.person.lastName();
    // const memberEmail = faker.internet.email();


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
  memberEmail : faker.internet.email()
};




    // Visit the signup page
    cy.visit('https://qa.bas.ng/');

    // Targets the Sign Up button inside the navigation/header area
       cy.get('nav, header').contains('Pricing').click();

      // Finds the first card container or column and clicks its button
    cy.get('.pricing-card, div').contains('Choose To Pay').first().click();


// Wrap your code inside the active origin block
cy.origin('https://qaapp.bas.ng', { args: userData },({firstName,lastName,generatedEmail,companyName,password,memberEmail,memberFirstName,memberLastName,branchAddress,branchName}) => {

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

    // Handle Custom Role Dropdown selection
    cy.get('button:has(span[data-slot="select-value"])').click({ force: true });
    cy.focused().type('Admin{enter}');
    cy.contains('[role="option"], div, span', 'Admin').should('exist').click({ force: true });

    // Proceed to Permissions
    cy.get('button').contains('Next: Set Admin Permissions').click();

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

    // Initiate Account Deletion
    cy.scrollTo('bottom');
    cy.get('button').contains(/Delete Account|Close Account|Delete Business/i).should('be.visible').click({ force: true });

    // Confirm deletion in modal
    cy.get('[role="dialog"], .modal').contains('button', /^Proceed$/).should('be.visible').click({ force: true });

    cy.wait(1000); // Settle animation

    // Fill verification details
    cy.get('[role="dialog"] input, .modal input, input[type="tel"]').first().type('12345', { force: true, delay: 100 });
    cy.get('textarea[placeholder*="why you are leaving"]').should('be.visible').type('Automated testing account cleanup.');
    cy.contains('button', /^Send verification code$/).should('be.visible').click({ force: true });



});










  });
});
