// describe('Login Page Automation', () => {
//   const baseUrl = '/godokpharmglobalenterprise/login';


//   beforeEach(() => {
//     cy.visit(baseUrl);
//   });

//   it('should successfully fill in login credentials and submit', () => {
//     // Fill in the Email field
//     cy.get('input[type="email"], input[name="email"]')
//       .should('be.visible')
//       .clear()
//       .type('godokliv84@gmail.com');

//     // Fill in the Password field (replace with your secure password or Cypress.env variable)
//     cy.get('input[type="password"]')
//       .should('be.visible')
//       .clear()
//       .type('Eazerd123@');

//     // Click the Log In button
//     cy.contains('button', 'Log In')
//       .should('be.enabled')
//       .click();

//      cy.wait(10000); // Wait for 10 seconds to allow for login processing

//     // Verify redirection/successful login and presence of dashboard element
//     cy.url().should('not.include', '/dashboard');


//     // 1. Click Stock Book in the sidebar layout to navigate
// cy.contains('Stock Book').click();

// // 2. Validate user path redirection to the Stock Book view
// // Validates URL endpoint updates correctly
// cy.url().should('include', '/stock-book'); 

// // Alternative Header text validation (adjust to match your page's H1 or title element text)
// cy.get('h1, h2, .page-title').should('contain', 'Stock Book');

// // 3. Target and select the Bulk Upload actionable option 
// // Looks for structural text matches like "+ Bulk Upload" or "+ Bulk Upload Stock"
// cy.contains('+ bulk upload', { matchCase: false }).click();


//   });

  

// });





describe('Product Bulk Upload Automation', () => {
  const userEmail = 'antaigodwin30@gmail.com'; 
  const userPassword = 'Eazerd123@';

  it('should navigate to Stock Book, select Bulk Upload, and upload products file', () => {
    // 1. Authenticate and Log In
    cy.visit('/godokpharmglobalenterprise/login');

    // 1. Populate operational administrative email and security credentials
    cy.get('input[placeholder="Enter email address"]').type(userEmail);
    cy.get('input[type="password"]').should('be.visible').type(userPassword);
    cy.get('button[type="submit"]').click();

    // 2. Navigate to the Stock Book Sidebar Menu
    cy.contains('a, div, span', /^Stock Book$/i)
      .should('be.visible')
      .click();

    // 3. Click the "+ Bulk Upload" Button (Highlighted Red Box)
       // 3. Click the "+ Bulk Upload" Button
      cy.contains('button, a, div, span', 'Bulk Upload')
        .scrollIntoView({ duration: 500 })
        .should('be.visible')
        .click();


    // // 4. Handle the File Upload Input inside the Modal/Popup
    // // Note: Adjust the input selector if the element has a specific class or ID
    // const fixtureFilePath = 'products.xlsx'; // Must be stored inside cypress/fixtures/
    
    // cy.get('input[type="file"]')
    //   .should('exist')
    //   .attachFile(fixtureFilePath);

    // // 5. Click the final Submit / Upload button inside the modal to process the document
    // cy.contains('button', /Upload|Submit|Process/i)
    //   .should('be.visible')
    //   .click();

    // // 6. Final Assertion: Verify the upload completion success notification banner
    // cy.contains('div, p, span, [role="status"]', /Successfully uploaded|Bulk upload processing/i)
    //   .should('be.visible');

    // --- STEP 4: ON THE BULK UPLOAD MODAL ---
    
    // 1. Optional: Test the "Download Template" button works
    // cy.contains('button, a', /Download Template \(\.xlsx\)/i)
    //   .should('be.visible')
    //   .click();

    // 2. Select your template file from the 'cypress/fixtures/' folder
    // Ensure 'products.xlsx' exists inside your project's cypress/fixtures/ directory
    const filePath = 'BAS/cypress/fixtures/BAS_Stock_Template.xlsx'; // Adjust the path if necessary

    // 3. Target the hidden file input hidden beneath the "Choose file" area
    cy.get('input[type="file"]')
      .first()
      .selectFile(filePath, { force: true }); // force: true handles masked drag-and-drop inputs

    // 4. Verify that the file upload registered (the "Upload File" button should become active)
    cy.contains('button', /^Upload File$/i)
      .should('be.visible')
      .should('not.be.disabled')
      .click();











  });
});












