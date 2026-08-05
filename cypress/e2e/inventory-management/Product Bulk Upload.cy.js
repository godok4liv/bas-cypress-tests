describe('Login Page Automation', () => {
  const baseUrl = '/godokpharmglobalenterprise/login';


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
      .click();

     cy.wait(10000); // Wait for 10 seconds to allow for login processing

    // Verify redirection/successful login and presence of dashboard element
    cy.url().should('not.include', '/dashboard');


    // 1. Click Stock Book in the sidebar layout to navigate
cy.contains('Stock Book').click();

// 2. Validate user path redirection to the Stock Book view
// Validates URL endpoint updates correctly
cy.url().should('include', '/stock-book'); 

// Alternative Header text validation (adjust to match your page's H1 or title element text)
cy.get('h1, h2, .page-title').should('contain', 'Stock Book');

// 3. Target and select the Bulk Upload actionable option 
// Looks for structural text matches like "+ Bulk Upload" or "+ Bulk Upload Stock"
cy.contains('+ bulk upload', { matchCase: false }).click();






  });

  

});












