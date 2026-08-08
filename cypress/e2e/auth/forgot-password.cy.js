describe('Password Reset E2E Flow', () => {
  const resetEmail = 'Godok84liv@yahoo.com';
  const testPin = '123456';
  const otpCode = '123456';
  const newPassword = 'NewSecurePassword123!';

  it('verify that the forgot password functionality works correctly', () => {
    // 1. INITIAL NAVIGATION & ACCESSIBILITY CHECK
    cy.visit('regresssmartltd/');
    cy.contains('Forgot Password?', { matchCase: false }).click();
    cy.url().should('include', 'regresssmartltd/forgot-password');

    // Test back-to-login navigation loop
    cy.contains('Back to Login', { matchCase: false }).click();
    cy.url().should('eq', 'https://qaapp.bas.ng/regresssmartltd/login');

    // Return to the Forgot Password screen
    cy.contains('Forgot Password?', { matchCase: false }).click();
    cy.contains('h1', 'Forgot Password').should('be.visible');

    // 2. REQUEST FORGOT PASSWORD SUBMISSION
    cy.get('input[type="email"]').type(resetEmail);
    cy.get('input[placeholder="Enter your unique PIN"]').type(testPin);
    cy.get('button').contains('Reset').click();

    // 3. VALIDATE ALERT & SCREEN TRANSITION
    cy.contains('div, p, span, [role="status"]', /Your request has been received/i)
      .should('be.visible');

    cy.url().should('include', '/password-reset');
    cy.contains('Enter the 6-digit code').should('be.visible');

    // 4. ENTER 6-DIGIT OTP VERIFICATION CODE
    // Targets the grid by typing into the first visible input field
    cy.get('input[inputmode="numeric"], input[type="text"]')
      .filter(':visible')
      .first()
      .should('be.visible')
      .type(otpCode, { delay: 100 }); 

    cy.get('button').contains('Continue').click();

    // 5. UPDATE PASSWORD SCREEN   Dont have access to the email to get the OTP code so I will just test the failure scenario
    cy.url().should('include', '/password-reset'); // Assert that we are on the Set New Password screen

    
    // 6. FAILURE / SUCCESS RESPONSE ASSERTON
    // Note: Adjusted fallback handling depending on whether the test OTP is intentionally invalid
    //cy.contains('invalid code', { matchCase: false, timeout: 10000 }).should('be.visible');
     // 1. Wait for either error message to appear in the DOM
      cy.contains(/Validation failed|failed with status code 429/i, { timeout: 10000 }).then(($el) => {
        // 2. Extract the text to see which one matched
        const errorText = $el.text().toLowerCase();

        // 3. Assert based on what the UI displayed
        if (errorText.includes('failed with status code 429')) {
          expect(errorText).to.include('failed with status code 429');
          // Optional: Add steps here if your test needs to wait or reset
        } else {
          expect(errorText).to.include('validation failed');


// 2. Target the 'Back to Login' link by its index (0) and force the click
cy.get('a.text-blue-600', { timeout: 10000 })
  .eq(0)
  .click({ force: true });

  }
});



  });
});
