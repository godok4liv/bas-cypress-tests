

import {faker} from '@faker-js/faker';
import { generateUser } from '../support/faker';
const userEmail = `godwin.test${Cypress._.random(1, 1000)}@example.com`;


  describe('BAS Registration Flow 2', () => {
    it('should complete the business setup form', () => {

      const newUser = generateUser();
      //const businessName = cy.generateDynamicName('Test'); // Generate a dynamic name with a prefix
      
      const firstName = faker.person.firstName();
      
      const lastName = faker.person.lastName();

      // 1. Navigate from Login to Sign Up
      cy.visit('/');

      cy.contains('Start Here', { matchCase: false }).click();

      // 2. Assert we are on the Setup page
      cy.contains('h1', "Let's Setup Your Account").should('be.visible');

      // 3. Fill in User Details first name, last name, email address
      
      cy.get('input[placeholder*="first name"]').type(firstName);

          //generate a random last name using faker
      
      cy.get('input[placeholder*="last name"]').type(lastName);
      
      cy.get('input[placeholder*="email address"]').type(newUser.email);

      // 4. Fill in Business Details
      cy.get('input[placeholder*="business name"]').type(newUser.company);




      // 5. Handle the Business Type Dropdown (Radix/Select component)
      cy.contains('Select business type').click();
      // Select an option from the resulting portal menu
      cy.get('[role="option"]').first().click({ force: true }); 

      // 6. Security Fields
      cy.get('input[placeholder="Enter password"]').first().type('StrongPass123!');

      // Target the second password input field on the page
      cy.get('input[type="password"]').eq(1).type('StrongPass123!');


      // 1. Prepare your logo file in the 'cypress/fixtures' folder (e.g., logo.png)
      // 2. Target the upload input
      // Most 'Choose file' triggers are linked to a hidden input[type="file"]
    cy.get('input[type="file"]').selectFile('cypress/fixtures/logo.png', { force: true });

    cy.screenshot();
    
    // 3. Alternatively, if you want to simulate a drag-and-drop onto the zone
          //cy.get('div').contains('Drag and Drop file here')
        //.selectFile('cypress/fixtures/logo.png', { action: 'drag-drop' });

      // 4. Final step: Click Save & Continue
    cy.contains('button', 'Save & Continue').click({ force: true });
    

      // 7. Submit the Form
      cy.contains('button', 'Save & Continue').should('be.visible').click({ force: true });


      // 1. Assert successful account creation
  // We use matchCase: false to stay consistent with your previous requests
  cy.contains('You Have Successfully Setup Your Account!', { matchCase: false }).should('be.visible');

  // 2. Assert the confirmation email was sent to the correct address
  cy.contains(newUser.email).should('be.visible');

  // 3. Automate clicking the "Continue" button
  // The button is teal and clearly marked "Continue"
  cy.contains('button', 'Continue')
    .should('be.enabled')
    .click({ force: true });

    // 2. Branch Setup Phase (Based on Image 2)
      //cy.url().should('include', '/setup-branch');
      cy.get('h1').should('contain', 'Setup Your First Branch');
      
      // Entering Branch Details
      cy.get('input[placeholder="Enter branch name"]').type(`${firstName} Headquarters`);
      cy.get('input[placeholder="Enter branch address"]').type(`${faker.location.streetAddress()}, ${faker.location.city()}`);
      
      // Save and Continue
      cy.get('button').contains('Save & Continue').click();
      //cy.wait(3000); // Wait for 3 seconds to allow for processing

      // 3. Success Validation
      //cy.contains('Branch created successfully').should('be.visible');



      // 3. Add First Team Member (image_dc33e5.png)
      //cy.url().should('include', '/add-team');
      cy.get('input[placeholder="Enter first name"]').type('john');
      cy.get('input[placeholder="Enter last name"]').type('Doe');
      cy.get('input[placeholder="Enter email address"]').type(firstName.toLowerCase()+'.'+lastName.toLowerCase()+`@example.com` );
      
      // Selecting a role from the dropdown
      //cy.get('[role="option"]').first().click(); 
      cy.get('select, [role="combobox"]').contains('Select a role').click({ force: true })  ; 
      //cy.contains('Admin').click({ force: true }); // Example role selection

    // cy.contains('Select a role').click()
      //cy.get('.role-option, div').contains('Admin', { matchCase: false }).click(); // Adjust class if needed
            
          cy.contains('Admin').should('be.visible');

              // 3. Click it // Use the container class
        cy.get('div[role="listbox"],.dropdown-menu, .role-options') .contains('Admin').click({ force: true });

          
            // 3. Verification
            // Ensure 'Admin' is now the value displayed in the field
            cy.get('[role="combobox"], .dropdown-selected-value').should('contain', 'Admin');

            //cy.wait(2000); // Wait for 3 seconds before clicking the next button



      cy.get('button').contains('Next: Set Admin Permissions').click();

      // 4. Final Verification
      cy.contains('Set Up Permissions').should('be.visible');




      // Assuming we just clicked "Next: Set Admin Permissions"
    cy.url().should('include', '/new-team-member');

    // Toggle specific permissions by their labels
    const permissionsToEnable = [
      'Can Create New User',
      'Can Access Sales Book',
      'Can Manage Stock Book',
      'can see '
    ];

    permissionsToEnable.forEach((permission) => {
      // We find the text, then find the checkbox next to it
      cy.contains('div', permission).click({ force: true });
    });

    // Finalize the onboarding
    cy.get('button').contains('Save Permissions & Add New Staff').click();

    // Verify Success Screen
      cy.contains('Successfully Added Your First Team Member').should('be.visible');
      cy.get('button').contains('Go To Dashboard').click();
      cy.url().should('include', '/dashboard');

        // Click the sidebar trigger (highlighted in your HTML inspector)
      // This targets the specific button intended for this action
      cy.get('[data-sidebar="trigger"]').click();

      cy.get('[data-sidebar="trigger"]').should('not.have.class', 'collapsed');

    
          // Verify Owner Name (Image 11 & 12)
            cy.contains(`${firstName} ${lastName}`).should('be.visible');  
          cy.contains('OWNER').should('be.visible');
            
    });
  });