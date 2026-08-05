import { faker } from '@faker-js/faker';

describe('Stock Book - Add & Delete Product End-to-End Lifecycle', () => {
  // Retrieve environment secrets or fallback defaults
  const userEmail = Cypress.env('USER_EMAIL') || 'antaigodwin30@gmail.com';
  const userPassword = Cypress.env('USER_PASSWORD') || 'Eazerd123@';
  const authPin = Cypress.env('SECURITY_PIN') || '12345';

  it('should complete the full product lifecycle: create, allocate, verify, delete, and paginate', () => {
    // ----------------------------------------------------
    // 1. AUTHENTICATION & NAVIGATION
    // ----------------------------------------------------
    cy.visit('godokpharmglobalenterprise/login');

    cy.get('input[placeholder="Enter email address"]').type(userEmail);
    cy.get('input[type="password"]').should('be.visible').type(userPassword);

    cy.get('input[type="email"]').click({ force: true }); // BUG TAKEN CARE OF FOR NOW

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');

    // Expand sidebar if collapsed and navigate to Stock Book
    cy.get('a[href*="stock-book"]', { timeout: 10000 })
      .should('exist')
      .click({ force: true }); // Fallback force click for animated overlays

    cy.url().should('include', '/dashboard/stock-book');

    // ----------------------------------------------------
    // 2. GENERATE DYNAMIC TEST DATA
    // ----------------------------------------------------
    const testProductName = `Med_${faker.commerce.productName().replace(/[^a-zA-Z\s]/g, '')}`;
    const testVendorName = faker.company.name().replace(/[^a-zA-Z\s]/g, '').trim();
    const testSerialNum = faker.string.numeric(12);
    const testQuantity = faker.number.int({ min: 10, max: 100 }).toString();
    const testCostPrice = faker.commerce.price({ min: 5, max: 50 });
    const testSellingPrice = faker.commerce.price({ min: 60, max: 150 });
    const testThreshold = faker.number.int({ min: 2, max: 5 }).toString();

    // Format tomorrow's date as YYYY-MM-DD for standard date input typing
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedExpiryDate = tomorrow.toISOString().split('T')[0];

    // ----------------------------------------------------
    // 3. CREATE NEW PRODUCT
    // ----------------------------------------------------
    cy.contains('button, a, span', /Add New Product/i)
      .should('be.visible')
      .click();

    // Form inputs
    cy.get('input[placeholder*="Enter product name"]').should('be.visible').type(testProductName);

    // Select category dropdown via keyboard interaction
    cy.get('[role="combobox"]').contains(/Select category/i).click({ force: true });
    cy.focused().type('{downarrow}{enter}');

    cy.get('input[placeholder*="vendor name"]').type(testVendorName);
    cy.get('input[placeholder*="serial number or scan"]').type(testSerialNum);
    cy.contains('button', /By unit/i).click();
    cy.get('input[placeholder*="Unit Qty"]').type(testQuantity);
    cy.get('input[type="date"], input[placeholder*="mm/dd/yyyy"]').type(formattedExpiryDate);

    // Pricing (using label relationship for stability)
    cy.contains('label', /Cost Price/i).parent().find('input').type(testCostPrice);
    cy.contains('label', /Selling Price/i).parent().find('input').type(testSellingPrice);
    cy.get('input[placeholder*="low stock"]').type(testThreshold);

    // Submit product form
    cy.contains('button', /Save & Allocate To Branches/i)
      .should('be.visible')
      .click();

    // ----------------------------------------------------
    // 4. BRANCH ALLOCATION & SECURITY PIN 1
    // ----------------------------------------------------
    cy.contains('div, label, span', 'GodokPharm CAL')
      .parent()
      .find('[role="checkbox"], input[type="checkbox"]')
      .click({ force: true });

    cy.contains('button', /Distribute Equally/i)
      .should('be.visible')
      .click();

    cy.contains('button', 'Add & Allocate Product')
      .scrollIntoView({ ensureScrollable: false })
      .should('be.visible')
      .click();

    // Handle 5-Digit PIN Authorization Modal
    cy.get('[role="dialog"] input, .modal input, input[type="tel"]')
      .first()
      .should('be.visible')
      .type(authPin, { delay: 100 });

    cy.contains('button', /Confirm/i).click();

    // Verify addition success
    cy.contains('p, div', 'Your new product was added to the stock book successfully.')
      .should('be.visible');

    cy.contains('button', /^OK$/).click();

    // ----------------------------------------------------
    // 5. DETAIL VALIDATION
    // ----------------------------------------------------
    cy.contains('h1, h2, div', testProductName).should('be.visible');
    cy.contains('div, span', `${testQuantity} units`).should('be.visible');

    cy.contains('div, p', 'SKU').parent().should('contain.text', testSerialNum);
    cy.contains('div, p', 'Minimum Stock Threshold').parent().should('contain.text', testThreshold);

    // ----------------------------------------------------
    // 6. TEARDOWN: PRODUCT DELETION & SECURITY PIN 2
    // ----------------------------------------------------
    cy.go('back');
    cy.url().should('include', '/stock-book');

    // Open row menu & click Delete
    cy.contains('table tr, div', testProductName)
      .find('button, svg, div')
      .last()
      .click({ force: true });

    cy.contains('ul li, button, span, div', 'Delete Product')
      .should('be.visible')
      .click();

    cy.get('[role="dialog"], .modal')
      .contains('button', 'Yes, Delete Product')
      .should('be.visible')
      .click();

    // Enter PIN for Deletion Authorization
    cy.get('[role="dialog"] input, .modal input, input[type="tel"]')
      .first()
      .should('be.visible')
      .type(authPin, { delay: 100 });

    cy.contains('button', /^Confirm$/).click();

    // Assert deletion modal & dismiss
    cy.contains('div, p, h2', 'Product Deleted Successfully!').should('be.visible');

    cy.get('[role="dialog"] button, .modal button')
      .find('svg, path, [data-slot="icon"]')
      .first()
      .click({ force: true });

    // ----------------------------------------------------
    // 7. PAGINATION VERIFICATION
    // ----------------------------------------------------
    // 1. Ensure page 1 is loaded first
    cy.contains('Showing 1 to 10').should('be.visible');

    // 2. Click Next button directly
    cy.contains('button', /^Next$/i)
      .scrollIntoView({ ensureScrollable: false })
      .should('be.visible')
      .click({ force: true });

    // 3. Allow time for table data to fetch & re-render page 2
    cy.contains('span, div, p', /Showing 11 to/i, { timeout: 15000 })
      .should('be.visible');
  });
});