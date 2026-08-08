import { faker } from '@faker-js/faker';

describe('BAS Signup, Onboarding & Business Account Deletion Suite', () => {
  // Shared static and runtime credentials
  const password = 'Password123!';
  const securityPin = '12345';
  const fileName = 'logo.png';
  
  // Dynamic business owner identity properties
  const ownerFirstName = faker.person.firstName();
  const ownerLastName = faker.person.lastName();
  const generatedEmail = faker.internet.email({ firstName: ownerFirstName, lastName: ownerLastName });
  const companyName = faker.company.name().replace(/[^a-zA-Z\s]/g, '').trim();

  // Dynamic localization properties for branch setup
  const branchName = `${faker.company.name().replace(/,/g, '')} Branch`;
  const branchAddress = faker.location.streetAddress();

  // Dynamic secondary team user identity fields
  const memberFirstName = faker.person.firstName();
  const memberLastName = faker.person.lastName();
  const memberEmail = faker.internet.email({ firstName: memberFirstName, lastName: memberLastName });

  it('TC_001: Should fill out structural credentials and register business owner account', () => {
    cy.visit('/signup');

    // Populate basic owner information fields
    cy.get('input[placeholder="Enter first name"]').type(ownerFirstName);
    cy.get('input[placeholder="Enter last name"]').type(ownerLastName);
    cy.get('input[placeholder="Enter email address"]').type(generatedEmail);
    cy.get('input[placeholder="Enter business name"]').type(companyName);

    // Select target industry from custom layout dropzone container
    cy.contains('label, span', 'Business Type')
      .parent()
      .find('[role="combobox"], button, input')
      .first()
      .click({ force: true });

    cy.contains('[role="option"], ul li, span', 'Pharmacy', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });

    // Confirm passwords match values
    cy.get('input[placeholder="Enter password"]').type(password);
    cy.get('input[type="password"]').last().type(password);

    // Attach local document fixture file stream safely
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`, { force: true });

    // Authorize platform agreements checkboxes and submit
    cy.get('[role="checkbox"]').first().click({ force: true });
    cy.contains('button, [role="button"]', 'Save & Continue').click({ force: true });

    // Validate registration checkpoint success redirect view
    cy.url().should('include', '/signup');
    cy.contains(generatedEmail).should('be.visible');
    cy.get('button, a').contains('Continue').click({ force: true });
  });

  it('TC_002: Should configure operational branch locations and team allocation roles', () => {
    // Populate primary operational physical workspace metadata
    cy.get('input[placeholder="Enter branch name"]').should('be.visible').type(branchName);
    cy.get('input[placeholder="Enter branch address"]').should('be.visible').type(branchAddress);
    cy.contains('button', 'Save & Continue').click({ force: true });

    // Allocate structural team member inputs
    cy.get('input[placeholder="Enter first name"]').type(memberFirstName);
    cy.get('input[placeholder="Enter last name"]').type(memberLastName);
    cy.get('input[placeholder="Enter email address"]').type(memberEmail);

    // Select dynamic system assignment dropdown nodes safely
    cy.get('button:has(span[data-slot="select-value"]), [role="combobox"]').first().click({ force: true });
    cy.contains('[role="option"], div, span', 'Admin').should('exist').click({ force: true });

    // Proceed through structural fine-grained security permission steps
    cy.contains('button', 'Next: Set Admin Permissions').click({ force: true });
    cy.scrollTo('bottom');
    cy.contains('button', /Save Permissions & Add New Staff/i).click({ force: true });

    cy.wait(4000); // Allow data storage processing buffer

    // Confirm creation and break workflow out to user dashboard session space
    cy.contains(memberEmail).should('be.visible');
    cy.contains('button, a', 'Go To Dashboard').should('be.visible').click({ force: true });
  });

  it('TC_003: Should authenticate core administrative account and access internal settings dashboard', () => {
    // Authenticate clean production session utilizing dynamic registration variables
    cy.get('input[placeholder="Enter email address"]').should('be.visible').type(generatedEmail);
    cy.get('input[type="password"]').should('be.visible').type(password);
    cy.contains('button', 'Log In').should('be.visible').click({ force: true });

    // Confirm dashboard canvas elements mount smoothly
    cy.url().should('include', '/dashboard');
    cy.contains('Daily Digest', { timeout: 10000 }).should('be.visible');
  });

  it('TC_004: Should access the business control pane and authorize account deletion requests', () => {
    // Route execution to internal advanced feature setting sub-panes
    cy.contains('a, button, span', /Business\s*Control/i, { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });
      
    cy.url().should('include', 'feature=settings');

    // Scroll to unsafe structural zones and click target close workflows triggers
    cy.scrollTo('bottom');
    cy.get('button')
      .contains(/Delete Account|Close Account|Delete Business/i)
      .should('be.visible')
      .click({ force: true });

    // Dismiss primary risk confirmation modal gates
    cy.get('[role="dialog"], .modal, .modal-content')
      .contains('button', /^Proceed$/)
      .should('be.visible')
      .click({ force: true });

    cy.wait(1000); // Allow modal animation layer transformations to finish

    // Authorize workflow with clean data entries and pin code
    cy.get('[role="dialog"] input, .modal input, input[type="tel"]')
      .first()
      .should('be.visible')
      .clear()
      .type(securityPin, { force: true, delay: 100 });

    cy.get('textarea[placeholder*="why you are leaving"]')
      .should('be.visible')
      .type('Automated testing clean security account deletion pipeline optimization run.', { force: true });

    // Finalize deletion trigger
    cy.contains('button', /^Send verification code$/).should('be.visible').click({ force: true });
  });
});
