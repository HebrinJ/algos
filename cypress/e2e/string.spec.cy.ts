/// <reference types="cypress" />
import { revert } from '../../src/components/string/revert'
import { ElementStates } from '../../src/types/element-states'

describe('String algorythm test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/recursion')
  })

  it('Button should be disabled if input empty', () => {
    cy.get('input').should('contain', '');
    cy.get('button').should('be.disabled');
    
    cy.get('input').type('HelloWorld');
    cy.get('button').should('not.be.disabled');
  })

  it('Should correct string animation revert', () => {
    const input = 'Minsk';

    cy.get('input').type(input);
    cy.get('button').contains('Развернуть').click();

    const result = revert(input);
    expect(result[0]).to.be.equal('ksniM')
    const snapShots = result[1];

    let shot = snapShots[0];
    testSnapShot(shot);
    cy.wait(1000);

    shot = snapShots[1];
    testSnapShot(shot);
    cy.wait(1000);

    shot = snapShots[2];
    testSnapShot(shot);    
    cy.wait(1000);

    shot = snapShots[3];
    testSnapShot(shot);    
  })
})

function testSnapShot(shot) {
  for (let i = 0; i < shot.length; i++) {
    let stringStateClass = 'circle_default'
    if(shot[i].state === ElementStates.Changing) {
      stringStateClass = 'circle_changing'
    } else if (shot[i].state === ElementStates.Modified) {
      stringStateClass = 'circle_modified'
    }

    cy.get('*[class^=circle_content]').contains(shot[i].value).parent().invoke('attr', 'class').should('contain', stringStateClass)
}}