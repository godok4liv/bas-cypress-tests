import { faker } from "@faker-js/faker";

describe('should successfully complete wallet balance sales to customer', () => {

  it('should successfully complete wallet balance sales to customer', () => {

    cy.visit('/godokpharmglobalenterprise/login');



    cy.get('input[placeholder="Enter email address"]').type('otester777@gmail.com');
    cy.get('input[type="password"]').should('be.visible').type('Eazerd123@');
    cy.get('button[type="submit"]').click();    

    // cy.contains('Point Of Sale', { matchCase: false }).should('be.visible');







  });
});