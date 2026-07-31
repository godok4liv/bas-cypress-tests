
            import { faker } from '@faker-js/faker';

describe('BAS Signup Form', () => {
  it('should successfully fill out and submit the signup form', () => {

      // 1. GENERATE DYNAMIC VALUES AT THE TOP OF THE TEST
    const generatedEmail = faker.internet.email();
    //const companyName = faker.company.name().replace(/,/gi, ''); // Remove commas for valid input
       const companyName = faker.company.name().replace(/[^a-zA-Z\s]/g, '').trim();
       const password = 'Password123!'; // Use a secure


    // Visit the signup page
    cy.visit('https://app.bas.ng/signup');

    // Fill in basic user details
    cy.get('input[placeholder="Enter first name"]').type(faker.person.firstName());
    cy.get('input[placeholder="Enter last name"]').type(faker.person.lastName());
    cy.get('input[placeholder="Enter email address"]').type(generatedEmail);
    cy.get('input[placeholder="Enter business name"]').type(companyName);  //enter a valid business name dynamically generated using faker

    // Select Business Type from dropdown
    // Note: Adjust selector if using a custom dropdown library (e.g., React-Select)
    //cy.get('select, [role="combobox"]').first().click();
    //cy.contains('Pharmacy').click(); // or 'Trader'


      cy.contains('label, span', 'Business Type').parent()   .find('[role="combobox"], button, input').click();

      // Step 1: Open the dropdown
      //cy.get('[role="combobox"]').contains('Select business type').click();

     // Step 2: Use direct visible text targeting with force if it is obscured
     cy.contains('[role="option"]', 'Pharmacy', { timeout: 10000 })
  .should('be.visible')
  .click({ force: true });



    // Fill in Password fields
    cy.get('input[placeholder="Enter password"]').type(password);
    cy.get('input[type="password"]').last().type(password);

    // Upload Logo (Optional)
    // Requires cypress-file-upload plugin if targeting an <input type="file">
    const fileName = 'logo.png'; // Place this file in cypress/fixtures/
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`, { force: true });

           // Accept Terms & Conditions
               //cy.get('input[type="checkbox"]').click({ force: true });
       cy.get('[role="checkbox"]').click(); // will click the first checkbox it finds, adjust selector if needed


    // Submit Form
    cy.contains('button, [role="button"]', 'Save & Continue').click();

    // Assert successful submission/navigation
    cy.url().should('include', '/signup');

        // 1. Verify the email address matches the expected text
          //cy.contains().should('be.visible');

           // 3. VERIFY SUCCESS PAGE (The new code)
    cy.contains(generatedEmail).should('be.visible');
    

 

      // 2. Click the Continue button
   cy.get('button, a').contains('Continue').click();



   // 1. Generate dynamic branch data
   const branchName = faker.company.name().replace(/,/g, '') + ' Branch';
    const branchAddress = faker.location.streetAddress();

    // 2. Fill out Branch Name
     cy.get('input[placeholder="Enter branch name"]')
  .should('be.visible')
  .type(branchName);

   // 3. Fill out Branch Address
  cy.get('input[placeholder="Enter branch address"]')
  .should('be.visible')
  .type(branchAddress);

// 4. Click Save & Continue
cy.get('button')
  .contains('Save & Continue')
  .click();



  // 1. Generate dynamic team member details
const memberFirstName = faker.person.firstName();
const memberLastName = faker.person.lastName();
const memberEmail = faker.internet.email();

// 2. Fill First Name and Last Name
cy.get('input[placeholder="Enter first name"]').type(memberFirstName);
cy.get('input[placeholder="Enter last name"]').type(memberLastName);

// 3. Fill Email Address
cy.get('input[placeholder="Enter email address"]').type(memberEmail);

// 4. Handle Custom Role Dropdown (Selects 'Admin' or 'Staff')
    //cy.get('[role="combobox"]').contains('Select a role').click({ force: true }); // Open the dropdown


    // Target the combobox or button container wrapping that text slot
           // test again cy.get('[role="combobox"], button').has('span[data-slot="select-value"]').click();

           // 1. Open the dropdown menu
cy.get('[role="combobox"]').contains('Select a role').click({ force: true });

     // 2. Select the option with a forced click to bypass the body scroll-lock
     //cy.contains('[role="option"], div, span', 'Admin').should('exist').click({ force: true });
     
     // 1. Click to open the role dropdown trigger
cy.get('button:has(span[data-slot="select-value"])').click({ force: true });

// 2. Type 'Admin' followed by the Enter key to select it
cy.focused().type('Admin{enter}');

cy.contains('[role="option"], div, span', 'Admin').should('exist').click({ force: true });

          

      //cy.contains('[role="option"], div, span', 'Admin').click(); 

// 5. Proceed to Permissions
cy.get('button').contains('Next: Set Admin Permissions').click();

            // 1. Scroll the container or page to find the Save button and click it
// Fallback: Force structural scrolling to the bottom of the window
cy.scrollTo('bottom');
cy.get('button').contains('Save Permissions & Add New Staff', { matchCase: false }).click({ force: true });

// Target the button directly and tell Cypress to scroll it into its container view
      /*cy.contains('button', 'Save Permissions & Add New Staff')
      .scrollIntoView({ ensureScrollable: true })
       .should('be.visible')
        .click({ force: true });*/

        


 cy.wait(4000); // Wait for 4 seconds to allow for processing


 // 1. Confirm the dynamic team member email is visible in the success message
cy.contains(memberEmail).should('be.visible');

// 2. Click the Go To Dashboard button
cy.contains('button, a', 'Go To Dashboard')
  .should('be.visible')
  .click();
   

      //atempt login with the newly created team member credentials
     // cy.visit('https://qaapp.bas.ng/regresssmartltd/login');
  

     // 1. Fill out the Email input with the stored signup email variable
cy.get('input[placeholder="Enter email address"]')
  .should('be.visible')
  .type(memberEmail); // Use the dynamically generated email from signup

// 2. Fill out the Password input with your original password variable
// Replace 'SecurePassword123' with whatever variable or string you used at signup
cy.get('input[type="password"]')
  .should('be.visible')
  .type('Password123'); 

// 3. Click the Log In button
cy.contains('button', 'Log In')
  .should('be.visible')
  .click();









  });
});
