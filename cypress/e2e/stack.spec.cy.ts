describe('Stack page tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/stack')
  })

  it('Button should be disabled if input empty', () => {
    cy.get('input').should('contain', '');
    cy.get('button').should('be.disabled');
    
    cy.get('input').type('6');
    cy.get('button').should('not.be.disabled');
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
    cy.get('div').should('not.include.text', '8');
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
})