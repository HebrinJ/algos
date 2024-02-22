/// <reference types="cypress" />
import { getElementWithValue, getBottomElementOfValue, getEmptyElementByIndex, getTopElementOfValue } from "./test-helper";

describe('Stack page tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/stack')
  })

  it('Button should be disabled if input empty', () => {
    cy.get('input').should('contain', '');
    cy.get('button').contains('Добавить').parent().should('be.disabled');
    
    cy.get('input').type('6');
    cy.get('button').contains('Добавить').parent().should('not.be.disabled');
  })

  it('Should correct remove element', () => {
    cy.get('input').type('3');
    cy.get('button').contains('Добавить').click();
    cy.wait(1100);

    cy.get('input').type('5');
    cy.get('button').contains('Добавить').click();
    cy.wait(1100);

    cy.get('input').type('8');
    cy.get('button').contains('Добавить').click();
    cy.wait(1100);

    cy.get('button').contains('Удалить').click();
    cy.wait(1100);
    cy.contains('8').should('not.exist');
  })

  it('Should clear stack', () => {
    cy.get('input').type('3');
    cy.get('button').contains('Добавить').click();
    cy.wait(1100);

    cy.get('input').type('5');
    cy.get('button').contains('Добавить').click();
    cy.wait(1100);

    cy.get('input').type('8');
    cy.get('button').contains('Добавить').click();
    cy.wait(1100);

    cy.get('button').contains('Очистить').click();
    cy.get('*[class^=stack-page_animationBox]').children().should('have.length', 0);
  })

  it('Should correct show animation', () => {
    cy.get('input').type('3');
    cy.get('button').contains('Добавить').click();    
    
    getTopElementOfValue('3').should('contain', 'top');
    getElementWithValue('3').invoke('attr', 'class').should('contain', 'circle_changing');

    cy.wait(1100);

    cy.get('input').type('1');
    cy.get('button').contains('Добавить').click(); 

    getTopElementOfValue('3').should('not.contain', 'top');
    getElementWithValue('3').invoke('attr', 'class').should('contain', 'circle_default');
    getTopElementOfValue('1').should('contain', 'top');
    getElementWithValue('1').invoke('attr', 'class').should('contain', 'circle_changing');

    cy.wait(1100);

    cy.get('input').type('5');
    cy.get('button').contains('Добавить').click(); 

    getTopElementOfValue('3').should('not.contain', 'top');
    getElementWithValue('3').invoke('attr', 'class').should('contain', 'circle_default');
    getTopElementOfValue('1').should('not.contain', 'top');
    getElementWithValue('1').invoke('attr', 'class').should('contain', 'circle_default');
    getTopElementOfValue('5').should('contain', 'top');
    getElementWithValue('5').invoke('attr', 'class').should('contain', 'circle_changing');

    cy.wait(1100);

    cy.get('button').contains('Удалить').click();

    getTopElementOfValue('3').should('not.contain', 'top');
    getElementWithValue('3').invoke('attr', 'class').should('contain', 'circle_default');
    getTopElementOfValue('1').should('not.contain', 'top');
    getElementWithValue('1').invoke('attr', 'class').should('contain', 'circle_default');
    getTopElementOfValue('5').should('contain', 'top');
    getElementWithValue('5').invoke('attr', 'class').should('contain', 'circle_changing');

    cy.wait(1100);

    getTopElementOfValue('3').should('not.contain', 'top');
    getElementWithValue('3').invoke('attr', 'class').should('contain', 'circle_default');
    getTopElementOfValue('1').should('contain', 'top');
    getElementWithValue('1').invoke('attr', 'class').should('contain', 'circle_default');
    cy.get('.text_type_circle').contains('5').should('not.exist');

  })
})