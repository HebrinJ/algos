/// <reference types="cypress" />

describe('service is available', function() {
    it('Should be available on localhost:3000', () => {
      cy.visit('http://localhost:3000');
    });
  }); 