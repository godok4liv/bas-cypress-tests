describe('Login Page Automation', () => {
  const baseUrl = 'https://qaapp.bas.ng/regresssmartltd/login';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('should successfully fill in login credentials and submit', () => {
    // Fill in the Email field
    cy.get('input[type="email"], input[name="email"]')
      .should('be.visible')
      .clear()
      .type('godokliv84@gmail.com');

    // Fill in the Password field (replace with your secure password or Cypress.env variable)
    cy.get('input[type="password"]')
      .should('be.visible')
      .clear()
      .type('Eazerd123@');

    // Click the Log In button
    cy.contains('button', 'Log In')
      .should('be.enabled')
      .click({ force: true });

    // Verify redirection/successful login URL or dashboard element
    cy.url().should('not.include', '/login');
  });

  it('should display validation error when password is under 8 characters', () => {
    cy.get('input[type="email"], input[name="email"]')
      .type('godokliv84@gmail.com');

    cy.get('input[type="password"]')
      .type('short');

    // Assert that the validation text is visible
    cy.contains('Password must be at least 8 characters')
      .should('be.visible');
  });
});
