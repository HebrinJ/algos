/// <reference types="cypress" />
import { getFibonacciNumbers } from '../../src/components/fibonacci-page/fibon';
import { getElementWithValue, getBottomElementOfValue, getEmptyElementByIndex, getTopElementOfValue, getElementIndexByValue } from "./test-helper";

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
  
  it('Should show correct fibonacci series', () => {

    cy.get('input').type('4');
    cy.get('button').contains('Рассчитать').click();

    getElementWithValue('1').invoke('attr', 'class').should('contain', 'circle_default');
    getElementIndexByValue('1').should('contain', '0');

    cy.wait(400);

    getElementWithValue('1').invoke('attr', 'class').should('contain', 'circle_default');
    getElementIndexByValue('1').should('satisfy', element => {
      return element.text() === '0' || element.text() === '1'});

    cy.wait(400);

    getElementWithValue('1').invoke('attr', 'class').should('contain', 'circle_default');
    getElementWithValue('2').invoke('attr', 'class').should('contain', 'circle_default');
    getElementWithValue('3').invoke('attr', 'class').should('contain', 'circle_default');

    cy.wait(400);

    getElementWithValue('1').invoke('attr', 'class').should('contain', 'circle_default');
    getElementWithValue('2').invoke('attr', 'class').should('contain', 'circle_default');
    getElementWithValue('3').invoke('attr', 'class').should('contain', 'circle_default');
    getElementWithValue('5').invoke('attr', 'class').should('contain', 'circle_default');

  })
})