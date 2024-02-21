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
        
        cy.get('.text_type_circle').contains('3').parent().parent().should('contain', 'head');
        cy.get('.text_type_circle').contains('3').parent().parent().should('contain', 'tail');
        cy.get('.text_type_circle').contains('3').parent().invoke('attr', 'class').should('contain', 'circle_changing');
        
        cy.wait(1100);

        cy.get('input').type('5');
        cy.get('button').contains('Добавить').click();

        cy.get('.text_type_circle').contains('3').parent().parent().should('contain', 'head');
        cy.get('.text_type_circle').contains('3').parent().parent().should('not.contain', 'tail');
        cy.get('.text_type_circle').contains('5').parent().parent().should('not.contain', 'head');
        cy.get('.text_type_circle').contains('5').parent().parent().should('contain', 'tail');
        cy.get('.text_type_circle').contains('3').parent().invoke('attr', 'class').should('contain', 'circle_default');
        cy.get('.text_type_circle').contains('5').parent().invoke('attr', 'class').should('contain', 'circle_changing');

        cy.wait(1100);

        cy.get('input').type('8');
        cy.get('button').contains('Добавить').click();

        cy.get('.text_type_circle').contains('3').parent().parent().should('contain', 'head');
        cy.get('.text_type_circle').contains('3').parent().parent().should('not.contain', 'tail');
        cy.get('.text_type_circle').contains('5').parent().parent().should('not.contain', 'head');
        cy.get('.text_type_circle').contains('5').parent().parent().should('not.contain', 'tail');
        cy.get('.text_type_circle').contains('8').parent().parent().should('contain', 'tail');
        cy.get('.text_type_circle').contains('3').parent().invoke('attr', 'class').should('contain', 'circle_default');
        cy.get('.text_type_circle').contains('5').parent().invoke('attr', 'class').should('contain', 'circle_default');
        cy.get('.text_type_circle').contains('8').parent().invoke('attr', 'class').should('contain', 'circle_changing');

        cy.wait(1100);

        cy.get('button').contains('Удалить').click();

        cy.get('.text_type_circle').contains('3').parent().parent().should('contain', 'head');
        cy.get('.text_type_circle').contains('3').parent().parent().should('not.contain', 'tail');
        cy.get('.text_type_circle').contains('5').parent().parent().should('not.contain', 'head');
        cy.get('.text_type_circle').contains('5').parent().parent().should('not.contain', 'tail');
        cy.get('.text_type_circle').contains('8').parent().parent().should('contain', 'tail');
        cy.get('.text_type_circle').contains('3').parent().invoke('attr', 'class').should('contain', 'circle_changing');
        cy.get('.text_type_circle').contains('5').parent().invoke('attr', 'class').should('contain', 'circle_default');
        cy.get('.text_type_circle').contains('8').parent().invoke('attr', 'class').should('contain', 'circle_default');

        cy.wait(1100);

        cy.get('*[class^=circle_content]').children().contains('0').prev().should('include.text', '');
        cy.get('.text_type_circle').contains('5').parent().parent().should('contain', 'head');
        cy.get('.text_type_circle').contains('5').parent().parent().should('not.contain', 'tail');
        cy.get('.text_type_circle').contains('8').parent().parent().should('not.contain', 'head');
        cy.get('.text_type_circle').contains('8').parent().parent().should('contain', 'tail');
        cy.get('.text_type_circle').contains('5').parent().invoke('attr', 'class').should('contain', 'circle_default');
        cy.get('.text_type_circle').contains('8').parent().invoke('attr', 'class').should('contain', 'circle_default');

      })
})