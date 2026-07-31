


describe('template spec', () => {
  it('passes', () => {
    cy.visit('regresssmartltd/');
    // Add your test steps here navigating to the forgot password page and verifying its functionality
    cy.contains('Forgot Password?', { matchCase: false }).click();

      // Assert we are on the forgot password page
    cy.url().should('include', 'regresssmartltd/forgot-password');

   // navigate back to login page
    cy.contains('Back to Login', { matchCase: false }).click();

     // Assert we are back on the login page
    cy.url().should('eq', 'https://qaapp.bas.ng/regresssmartltd/login'); // Adjust the URL as needed

   // Click the "Forgot Password?" link
    cy.contains('Forgot Password?', { matchCase: false }).click();

     // Assert we are on the forgot password page
    cy.contains('h1', 'Forgot Password').should('be.visible');

      // Enter an email address and submit the form
    cy.get('input[type="email"]').type('Godok84liv@yahoo.com');

     // 2. Enter Unique PIN
    // Note: The UI looks like a dropdown or a masked input; 
    // we target it by the placeholder seen in your image.
    cy.get('input[placeholder="Enter your unique PIN"]')
      .type('123456'); // Replace with a valid test PIN

    cy.get('button').contains('Reset').click();

   // Phase 2: Validate the Alert (Image 16)
    // We target the toast notification typically by its role or common class
    //cy.get('[role="status"], .toast, .alert')  .should('be.visible').and('contain', 'Verification code sent to your email');

     cy.contains('Verification code sent to your email', { timeout: 10000 }).should('be.visible');

    // Phase 3: Transition Check
      cy.url().should('include', '/password-reset');
      cy.contains('Enter the 6-digit code').should('be.visible');

    // --- Phase 2: Verification Code (image_2ee499.png) ---
    // Verify we are on the verification screen
    //cy.contains('Enter the 6-digit code').should('be.visible');

    // Targeting the 6 input boxes. 
    // Since they usually don't have unique names, we use .eq() to target them by index.
    //const verificationCode = '987654';

   // verificationCode.split('').forEach((digit, index) => {
    //  cy.get('input[type="text"], input[inputmode="numeric"]').eq(index).type(digit);
        //});

      const code = '123456';
    
    // 1. Target all inputs within the password reset container
    // We use a small delay to ensure the UI captures each keystroke
        //cy.get('input[inputmode="numeric"], input[type="text"]').should('have.length', 6) // Ensure all 6 boxes are loaded first
         //.each(($el, index) => {
         // cy.wrap($el).type(code[index], { delay: 100 });
     // });



     // 1. Wait for the first input to be visible
    cy.get('input[inputmode="numeric"], input[type="text"]')
      .first()
      .should('be.visible')
      .type(code, { delay: 100 }); 
      // Many OTP components automatically distribute the 6 digits 
      // across the boxes if you type them into the first box.

    // Click Continue
    cy.get('button').contains('Continue').click();

    // Final Success Check
    cy.contains('Set New Password').should('be.visible');


    // 1. Enter New Password
    cy.get('input[placeholder="Enter your new password"]')
      .type('NewSecurePassword123!', { force: true });

    // 2. Confirm New Password
    cy.get('input[placeholder="Confirm your new password"]')
      .type('NewSecurePassword123!', { force: true });

    // 3. Click Reset Password
    cy.get('button').contains('Reset Password').click();

      // Assert that an error message appears for invalid code (if applicable)
    cy.contains('invalid code', { matchCase: false, timeout: 10000 }).should('be.visible');

    // 4. Success Verification
    //cy.contains('Password reset successful').should('be.visible');
    //cy.url().should('include', '/login');

  })
})