describe('Stock Request Automation Flow', () => {

  beforeEach(() => {
    // 1. Login with provided admin credentials
    cy.visit('/godokpharmglobalenterprise/login'); // Replace URL with your actual login path if different
    cy.get('input[type="email"]').type('godokliv84@gmail.com');
    cy.get('input[type="password"]').type('Eazerd123@');
    cy.get('button[type="submit"]').click();

    // Ensure navigation to dashboard/app home succeeded
    cy.url().should('not.include', '/login');
  });

  it('should request stock from another branch and authorize with PIN', () => {
    // 2. Navigate to Stock Book section from sidebar
    cy.contains('div, a, span', 'Stock Book').click();

    // 3. Switch to the Stock Request tab
    cy.contains('button, div, span', 'Stock Request').click();

    // 4. Click "+ Request Stock" button
    cy.contains('button', 'Request Stock').click();

    // 5. Fill out the "Request For Stock" modal fields
    // Select Branch (Requesting From) -> Calabar Municipal
    cy.contains('label', 'Select Branch (Requesting From)')
      .parent()
      .find('select, input, [role="combobox"]')
      .click();
   // cy.contains('Calabar Municipal').click({ force: true });

// 2. Type "Calabar Municipal" into the search box inside the dropdown menu
//cy.get('input[placeholder="Search branches..."]').type('Calabar Municipal');

// 3. Click the option from the filtered list
cy.get('[class*="dropdown-menu"], [role="listbox"]')
  .contains('Calabar Municipal')
  .click();







// 1. Click the 'Product Name' dropdown trigger to open it
cy.contains('label', 'Product Name')
  .parent()
  .find('[class*="-control"], .select, [role="combobox"], input')
  .first()
  .click();

// 2. Select a random option ONLY from the search box popup items
cy.get('[role="dialog"], .modal') // Force context inside the modal overlay wrapper
  .find('input[placeholder="Search products..."]')
  .closest('div') // Move to the immediate wrapper containing the search bar and its list options
  .parent()
  .find('div')
  .filter((index, el) => {
    const text = el.innerText?.trim();
    // Exclude the search input block, empty strings, and the parent navigation nodes
    return text && 
           text !== 'Search products...' && 
           text !== 'Select product' &&
           !el.querySelector('input') && 
           el.childNodes.length === 1;
  })
  .then(($options) => {
    const totalProducts = $options.length;
    
    if (totalProducts === 0) {
      throw new Error("Could not extract selectable products from the opened dropdown view.");
    }
    
    // Generate a random selection index
    const randomIndex = Math.floor(Math.random() * totalProducts);
    const chosenProduct = $options.eq(randomIndex);
    const chosenProductName = chosenProduct.text().trim();
    
    cy.log(`Successfully isolated and selected product item: **${chosenProductName}**`);
    
    // Select the clean product layer item
    cy.wrap(chosenProduct).click({ force: true });
  });

// 3. Assert the Request button inside the modal is active and click it
cy.get('[role="dialog"], .modal')
  .contains('button', 'Request')
  .should('be.visible')
  .and('not.be.disabled')
  .click();

  


    





    // Submit initial request form
    cy.get('button').contains('Request').click();

    // 6. 5-Digit Security PIN Authorization
    const pin = '12042';
    cy.get('input[type="password"], input[type="text"][maxlength="1"]').each(($el, index) => {
      cy.wrap($el).type(pin[index]);
    });

    // Confirm authorization
    cy.contains('button', 'Confirm').click();

    // 7. Verify the new stock request appears as Pending in the table
    cy.get('table, tr').contains('tr', 'cokew').within(() => {
      cy.contains('Calabar Municipal').should('be.visible');
      cy.contains('Pending').should('be.visible');
      cy.contains('Confirm').should('be.visible');
    });
  });
});