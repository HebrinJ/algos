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
    
    cy.get('.text_type_circle').contains('3').parent().parent().should('contain', 'top');
    cy.get('.text_type_circle').contains('3').parent().invoke('attr', 'class').should('contain', 'circle_changing');

    cy.wait(1100);

    cy.get('input').type('1');
    cy.get('button').contains('Добавить').click(); 

    cy.get('.text_type_circle').contains('3').parent().parent().should('not.contain', 'top');
    cy.get('.text_type_circle').contains('3').parent().invoke('attr', 'class').should('contain', 'circle_default');
    cy.get('.text_type_circle').contains('1').parent().parent().should('contain', 'top');
    cy.get('.text_type_circle').contains('1').parent().invoke('attr', 'class').should('contain', 'circle_changing');

    cy.wait(1100);

    cy.get('input').type('5');
    cy.get('button').contains('Добавить').click(); 

    cy.get('.text_type_circle').contains('3').parent().parent().should('not.contain', 'top');
    cy.get('.text_type_circle').contains('3').parent().invoke('attr', 'class').should('contain', 'circle_default');
    cy.get('.text_type_circle').contains('1').parent().parent().should('not.contain', 'top');
    cy.get('.text_type_circle').contains('1').parent().invoke('attr', 'class').should('contain', 'circle_default');
    cy.get('.text_type_circle').contains('5').parent().parent().should('contain', 'top');
    cy.get('.text_type_circle').contains('5').parent().invoke('attr', 'class').should('contain', 'circle_changing');

    cy.wait(1100);

    cy.get('button').contains('Удалить').click();

    cy.get('.text_type_circle').contains('3').parent().parent().should('not.contain', 'top');
    cy.get('.text_type_circle').contains('3').parent().invoke('attr', 'class').should('contain', 'circle_default');
    cy.get('.text_type_circle').contains('1').parent().parent().should('not.contain', 'top');
    cy.get('.text_type_circle').contains('1').parent().invoke('attr', 'class').should('contain', 'circle_default');
    cy.get('.text_type_circle').contains('5').parent().parent().should('contain', 'top');
    cy.get('.text_type_circle').contains('5').parent().invoke('attr', 'class').should('contain', 'circle_changing');

    cy.wait(1100);

    cy.get('.text_type_circle').contains('3').parent().parent().should('not.contain', 'top');
    cy.get('.text_type_circle').contains('3').parent().invoke('attr', 'class').should('contain', 'circle_default');
    cy.get('.text_type_circle').contains('1').parent().parent().should('contain', 'top');
    cy.get('.text_type_circle').contains('1').parent().invoke('attr', 'class').should('contain', 'circle_default');

  })
})