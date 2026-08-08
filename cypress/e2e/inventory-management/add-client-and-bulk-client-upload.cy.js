import { faker } from '@faker-js/faker';

describe('Client Management & Bulk Upload Automation Suite', () => {
  const userEmail = 'antaigodwin30@gmail.com'; 
  const userPassword = 'Eazerd123@';
  const securityPin = '12345';

  // Pre-generate dynamic values at suite level for Case 2 usage
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const middleName = faker.person.middleName();
  const email = faker.internet.email({ firstName, lastName });
  
  const mobilePrefix = faker.helpers.arrayElement(['080', '081', '070', '090']);
  const phoneNumber = mobilePrefix + faker.string.numeric(8); 
  
  const address = faker.location.streetAddress();
  const notes = faker.lorem.sentence();

  // Establish active authenticated baseline session before running tests
  beforeEach(() => {
    cy.visit('/godokpharmglobalenterprise/login');
    cy.get('input[placeholder="Enter email address"]').type(userEmail);
    cy.get('input[type="password"]').should('be.visible').type(userPassword);
    cy.get('button[type="submit"]').click();

    cy.contains('a, div, span', /^Client Book$/i)
      .should('be.visible')
      .click();
  });

  it('TC_001: Should complete the end-to-end client bulk upload workflow successfully', () => {
    // INITIALIZE BULK UPLOAD
    cy.contains('button, a, div, span', 'Bulk Upload')
      .scrollIntoView({ duration: 500 })
      .should('be.visible')
      .click();

    // DOWNLOAD TEMPLATE & ATTACH SHEET FILE
    cy.contains('button, a', /Download Template \(\.xlsx\)/i)
      .should('be.visible')
      .click();

    const filePath = 'cypress/fixtures/Populated_BAS_Client_Template.xlsx';

    cy.get('input[type="file"]')
      .first()
      .selectFile(filePath, { force: true });

    cy.contains('button', /^Upload File$/i)
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    // DYNAMIC FILE PARSING VALIDATION
    cy.contains('div, p, span', /new clients found/i)
      .should('be.visible')
      .invoke('text')
      .then((bannerText) => {
        const match = bannerText.match(/\d+/);
        const expectedClientCount = match ? parseInt(match[0], 10) : 0;
        
        cy.log(`🎯 Discovered client count from UI banner: ${expectedClientCount}`);

        cy.get('div[class*="modal"], div[class*="popup"], [role="dialog"]')
          .find('table tbody tr, div[role="row"]')
          .should('have.length', expectedClientCount);
      });

    cy.contains('button, div, span', /^Confirm\s*&\s*Save\s*Clients$/i)
      .should('be.visible')
      .click();

    // AUTHORIZE SECURITY PIN
    cy.contains('h2, div, p, span', /Confirm Bulk Upload/i).should('be.visible');

    cy.get('[role="dialog"], .modal-content, div[class*="modal"]')
      .find('input')
      .first()
      .should('be.visible')
      .clear()
      .type(securityPin, { delay: 100 });

    cy.contains('button', /^Confirm$/i)
      .should('not.be.disabled')
      .click();

    // DISMISS SUCCESS CONFIRMATION MODAL
    cy.contains('Upload Received').should('exist');

    cy.contains('button, div, span', /^Done$/i)
      .scrollIntoView()
      .should('exist')
      .click({ force: true });

    cy.contains('Upload Received').should('not.exist');
  });

  it('TC_002: Should add single client and validate count increment using dynamic Faker variables', () => {
    // EXTRACT INITIAL BADGE COUNTER METRICS
    cy.contains('div, p, span, h2', /^Client Book/i)
      .closest('div, flex')
      .invoke('text')
      .then((fullHeaderText) => {
        const match = fullHeaderText.match(/\d+/);
        const initialCount = match ? parseInt(match[0], 10) : 0;
        const expectedCount = initialCount + 1;
        
        cy.log(`📈 Initial Client Count: ${initialCount} | Expected Target: ${expectedCount}`);

        // OPEN INPUT REGISTRATION FORM
        cy.contains('button, a, span', /Add New client/i)
          .should('be.visible')
          .click();

        cy.contains('h2, h3, div, p', /^Add New Client$/i).should('be.visible');

        // POPULATE FORM FORM FIELDS DYNAMICALLY
        cy.get('input[placeholder="Enter first name"]').type(firstName);
        cy.get('input[placeholder="Enter last name"]').type(lastName);
        cy.get('input[placeholder="Enter middle name"]').type(middleName);
        cy.get('input[placeholder="Enter email address"]').type(email);
        cy.get('input[placeholder*="08062190987"]').type(phoneNumber);
        cy.get('input[placeholder="Enter address"]').type(address);
        cy.get('input[placeholder="MM-DD"]').type('10-24');
        cy.get('textarea[placeholder*="additional notes"]').type(notes);

        cy.contains('button', /^Continue$/i)
          .should('not.be.disabled')
          .click();

        // RUN SECURITY AUTHORIZATION
        cy.contains('div, p, span', /enter your 5-digit PIN to authorize/i).should('be.visible');

        cy.get('[role="dialog"], .modal-content, div[class*="modal"]')
          .find('input')
          .first()
          .should('be.visible')
          .clear()
          .type(securityPin, { delay: 100 });

        cy.contains('button', /^Confirm$/i)
          .should('not.be.disabled')
          .click();

        // VALIDATE REFRESHED METRIC SUCCESS
        cy.reload();

    
        // 3. Target the refreshed element independently and assert the count has updated
      // Constructing a direct dynamic string text check handles async loading beautifully
      cy.contains('div, p, span, h2', new RegExp(`Client Book.*${expectedCount}`, 'i'))
        .should('be.visible');

      // 4. Search for the dynamic faker client record to double-check table integration
      // cy.get('input[placeholder*="Search client name"]').first().type(`${firstName}`);


            cy.get('input[placeholder*="Search client name"]')
          .first()
          .type(firstName, {force: true})     // 1. First type the dynamic name strictly as text
          // .type('{enter}');    // 2. Chain a dedicated event execution for the return key
        cy.wait(1000);          // 3. Allow a brief pause for table re-rendering

      // 5. Assert that the newly added client appears in the table with correct details  

        cy.get('table, [role="table"]')
        .should('contain', firstName)
        .and('contain', lastName);
    






      });
  });
});
