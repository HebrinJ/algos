/// <reference types="cypress" />
import { getElementWithValue, getBottomElementOfValue, getEmptyElementByIndex, getTopElementOfValue } from "./test-helper";

describe('Stack page tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/queue')
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
        cy.get('*[class^=circle_content]').children().contains('0').prev().should('not.include.text', '3');
      })

    it('Should clear queue', () => {
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

        cy.get('*[class^=circle_content]').children().contains('0').prev().should('include.text', '');
        cy.get('*[class^=circle_content]').children().contains('1').prev().should('include.text', '');
        cy.get('*[class^=circle_content]').children().contains('2').prev().should('include.text', '');

      })

    it('Should show correct animation', () => {

        cy.get('input').type('3');
        cy.get('button').contains('Добавить').click();
        
        getTopElementOfValue('3').should('contain', 'head');
        getBottomElementOfValue('3').should('contain', 'tail');
        getElementWithValue('3').invoke('attr', 'class').should('contain', 'circle_changing');
        
        cy.wait(1100);

        cy.get('input').type('5');
        cy.get('button').contains('Добавить').click();

        getTopElementOfValue('3').should('contain', 'head');
        getBottomElementOfValue('3').should('not.contain', 'tail');
        getTopElementOfValue('5').should('not.contain', 'head');
        getBottomElementOfValue('5').should('contain', 'tail');
        getElementWithValue('3').invoke('attr', 'class').should('contain', 'circle_default');
        getElementWithValue('5').invoke('attr', 'class').should('contain', 'circle_changing');

        cy.wait(1100);

        cy.get('input').type('8');
        cy.get('button').contains('Добавить').click();

        getTopElementOfValue('3').should('contain', 'head');
        getBottomElementOfValue('3').should('not.contain', 'tail');
        getTopElementOfValue('5').should('not.contain', 'head');
        getBottomElementOfValue('5').should('not.contain', 'tail');
        getBottomElementOfValue('8').should('contain', 'tail');
        getElementWithValue('3').invoke('attr', 'class').should('contain', 'circle_default');
        getElementWithValue('5').invoke('attr', 'class').should('contain', 'circle_default');
        getElementWithValue('8').invoke('attr', 'class').should('contain', 'circle_changing');

        cy.wait(1100);

        cy.get('button').contains('Удалить').click();

        getTopElementOfValue('3').should('contain', 'head');
        getBottomElementOfValue('3').should('not.contain', 'tail');
        getTopElementOfValue('5').should('not.contain', 'head');
        getBottomElementOfValue('5').should('not.contain', 'tail');
        getBottomElementOfValue('8').should('contain', 'tail');
        getElementWithValue('3').invoke('attr', 'class').should('contain', 'circle_changing');
        getElementWithValue('5').invoke('attr', 'class').should('contain', 'circle_default');
        getElementWithValue('8').invoke('attr', 'class').should('contain', 'circle_default');

        cy.wait(1100);

        getEmptyElementByIndex(0).should('include.text', '');
        getTopElementOfValue('5').should('contain', 'head');
        getBottomElementOfValue('5').should('not.contain', 'tail');
        getTopElementOfValue('8').should('not.contain', 'head');
        getBottomElementOfValue('8').should('contain', 'tail');
        getElementWithValue('5').invoke('attr', 'class').should('contain', 'circle_default');
        getElementWithValue('8').invoke('attr', 'class').should('contain', 'circle_default');

      })
})