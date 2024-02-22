/// <reference types="cypress" />
import { getElementIndexByValue, getElementWithValue, getBottomElementOfValue, getEmptyElementByIndex, getTopElementOfValue } from "./test-helper";

describe('Stack page tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/list')
    })

    it('Button should be disabled if input empty', () => {
        cy.get('[data-name="input-value"]').should('contain', '');
        cy.get('[data-name="input-index"]').should('contain', '');
        
        cy.get('button').contains('Добавить в head').parent().should('be.disabled');
        cy.get('button').contains('Добавить в tail').parent().should('be.disabled');
        cy.get('button').contains('Добавить по индексу').parent().should('be.disabled');
        
        cy.get('[data-name="input-value"]').type('6');
        cy.get('button').contains('Добавить в head').parent().should('not.be.disabled');
        cy.get('button').contains('Добавить в tail').parent().should('not.be.disabled');
        cy.get('button').contains('Добавить по индексу').parent().should('be.disabled');

        cy.get('[data-name="input-index"]').type('2');
        cy.get('button').contains('Добавить в head').parent().should('not.be.disabled');
        cy.get('button').contains('Добавить в tail').parent().should('not.be.disabled');
        cy.get('button').contains('Добавить по индексу').parent().should('not.be.disabled');
    })

    it('Should show correct default list', () => {

        getTopElementOfValue('0').should('contain', 'head');
        getBottomElementOfValue('0').should('not.contain', 'tail');
        getElementIndexByValue('0').should('contain', '0');
        getElementWithValue('0').invoke('attr', 'class').should('contain', 'circle_default');

        getTopElementOfValue('34').should('not.contain', 'head');
        getBottomElementOfValue('34').should('not.contain', 'tail');
        getElementIndexByValue('34').should('contain', '1');
        getElementWithValue('34').invoke('attr', 'class').should('contain', 'circle_default');

        getTopElementOfValue('8').should('not.contain', 'head');
        getBottomElementOfValue('8').should('not.contain', 'tail');
        getElementIndexByValue('8').should('contain', '2');
        getElementWithValue('8').invoke('attr', 'class').should('contain', 'circle_default');

        getTopElementOfValue('1').should('not.contain', 'head');
        getBottomElementOfValue('1').should('contain', 'tail');
        getElementIndexByValue('1').should('contain', '3');
        getElementWithValue('1').invoke('attr', 'class').should('contain', 'circle_default');        

    })

    it('Should add element to the head', () => {

        cy.get('[data-name="input-value"]').type('6')
        cy.get('button').contains('Добавить в head').click();

        getTopElementOfValue('0').invoke('attr', 'class').should('contain', 'circle_element');
        getTopElementOfValue('0').should('contain', '6');
        getElementIndexByValue('0').should('contain', '0');
        getElementWithValue('0').invoke('attr', 'class').should('contain', 'circle_changing');

        cy.wait(1100);

        getTopElementOfValue('6').invoke('attr', 'class').should('contain', 'head');
        getElementIndexByValue('6').should('contain', '0');
        getElementWithValue('6').invoke('attr', 'class').should('contain', 'circle_modified');

        cy.wait(1100);

        // Проверка отрисовки добавленного элемента и соседнего элемента после окончания анимации

        getTopElementOfValue('6').should('contain', 'head');
        getElementIndexByValue('6').should('contain', '0');
        getElementWithValue('6').invoke('attr', 'class').should('contain', 'circle_default');
        getTopElementOfValue('0').should('not.contain', 'head');
        getElementIndexByValue('0').should('contain', '1');
        getElementWithValue('0').invoke('attr', 'class').should('contain', 'circle_default');

    })

    it('Should add element to the tail', () => {

        cy.get('[data-name="input-value"]').type('9');
        cy.get('button').contains('Добавить в tail').click();
        
        getTopElementOfValue('1').invoke('attr', 'class').should('contain', 'circle_element');
        getBottomElementOfValue('1').should('contain', 'tail');
        getElementIndexByValue('1').should('contain', '3');
        getElementWithValue('1').invoke('attr', 'class').should('contain', 'circle_changing');

        cy.wait(1100);

        getBottomElementOfValue('9').should('contain', 'tail');
        getElementIndexByValue('9').should('contain', '4');
        getElementWithValue('9').invoke('attr', 'class').should('contain', 'circle_modified');

        cy.wait(1100);

        // Проверка отрисовки добавленного элемента и соседнего элемента после окончания анимации

        getBottomElementOfValue('9').should('contain', 'tail');
        getElementIndexByValue('9').should('contain', '4');
        getElementWithValue('9').invoke('attr', 'class').should('contain', 'circle_default');

    })

    it('Should add element by the index', () => {

        cy.get('[data-name="input-value"]').type('9')
        cy.get('[data-name="input-index"]').type('2')
        cy.get('button').contains('Добавить по индексу').click();
        
        // Проверка анимации
        // Шаг 1
        getElementWithValue('0').invoke('attr', 'class').should('contain', 'circle_changing');
        getTopElementOfValue('0').should('contain', 'head');
        getElementIndexByValue('0').should('contain', '0');        

        cy.wait(2000);        
        
        // Шаг 2
        getElementWithValue('0').invoke('attr', 'class').should('contain', 'circle_changing');
        getTopElementOfValue('34').invoke('attr', 'class').should('contain', 'circle_element');
        getTopElementOfValue('34').next().invoke('attr', 'class').should('contain', '9');

        cy.wait(500);

        // Шаг 3
        getElementWithValue('0').invoke('attr', 'class').should('contain', 'circle_changing');
        getElementWithValue('34').invoke('attr', 'class').should('contain', 'circle_changing');
        getTopElementOfValue('8').invoke('attr', 'class').should('contain', 'circle_element');
        getTopElementOfValue('8').next().invoke('attr', 'class').should('contain', '9');
        getElementIndexByValue('8').should('contain', '2');

        cy.wait(500);

        // Шаг 4
        getElementWithValue('0').invoke('attr', 'class').should('contain', 'circle_default');
        getElementWithValue('34').invoke('attr', 'class').should('contain', 'circle_default');
        getElementWithValue('8').invoke('attr', 'class').should('contain', 'circle_changing');
        getTopElementOfValue('8').invoke('attr', 'class').should('contain', 'circle_element');
        getElementIndexByValue('8').should('contain', '2');

        cy.wait(500);

        // Шаг 5
        getElementWithValue('0').invoke('attr', 'class').should('contain', 'circle_default');
        getElementWithValue('34').invoke('attr', 'class').should('contain', 'circle_default');
        getElementWithValue('8').invoke('attr', 'class').should('contain', 'circle_default');
        getElementWithValue('9').invoke('attr', 'class').should('contain', 'circle_default');
        getElementIndexByValue('8').should('contain', '3');
        getElementIndexByValue('9').should('contain', '2');
        
    })

    it('Should remove element from the head', () => {

        cy.get('button').contains('Удалить из head').click();

        getEmptyElementByIndex(0).invoke('attr', 'class').should('contain', 'circle_changing');
        getEmptyElementByIndex(0).next().next().invoke('attr', 'class').should('contain', 'circle_element');
        getEmptyElementByIndex(0).next().next().invoke('attr', 'class').should('contain', '0');

        cy.wait(500);

        getElementWithValue('34').invoke('attr', 'class').should('contain', 'circle_default');
        getTopElementOfValue('34').should('contain', 'head');
        getElementIndexByValue('34').should('contain', '0');

    })

    it('Should remove element from the tail', () => {

        cy.get('button').contains('Удалить из tail').click();

        getEmptyElementByIndex(3).invoke('attr', 'class').should('contain', 'circle_changing');
        getEmptyElementByIndex(3).next().next().invoke('attr', 'class').should('contain', 'circle_element');
        getEmptyElementByIndex(3).next().next().should('contain', '1');

        cy.wait(500);

        getElementWithValue('8').invoke('attr', 'class').should('contain', 'circle_default');
        getBottomElementOfValue('8').should('contain', 'tail');
        getElementIndexByValue('8').should('contain', '2');
        
    })

    it('Should remove element by the index', () => {

        cy.get('[data-name="input-index"]').type('2')
        cy.get('button').contains('Удалить по индексу').click();

        // Проверка анимации
        // Шаг 1
        getElementWithValue('0').invoke('attr', 'class').should('contain', 'circle_changing');

        cy.wait(1000);        
        
        // Шаг 2
        getElementWithValue('34').invoke('attr', 'class').should('contain', 'circle_changing');
        cy.wait(500);

        // Шаг 3
        getElementWithValue('8').invoke('attr', 'class').should('contain', 'circle_changing');
        cy.wait(500);

        // Шаг 4
        getEmptyElementByIndex(2).next().next().invoke('attr', 'class').should('contain', 'circle_element');
        getEmptyElementByIndex(2).next().next().should('contain', '8');
    })

})