/// <reference types="cypress" />
import { getFibonacciNumbers } from '../../src/components/fibonacci-page/fibon';

describe('Fibonacci tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/fibonacci')
  })

  it('Button should be disabled if input empty', () => {
    cy.get('input').should('contain', '');
    cy.get('button').should('be.disabled');
    
    cy.get('input').type('9');
    cy.get('button').should('not.be.disabled');
  })

  it('Should return correct fibonacci series', () => {
    const input = 7;
    const result = getFibonacciNumbers(input);
    const series = [1, 1, 2, 3, 5, 8, 13, 21];
    
    cy.get('input').type(input.toString());
    expect(series).to.deep.equal(result);
  })
})