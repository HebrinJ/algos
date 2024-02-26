export function getElementWithValue(value: string) {
    return cy.get('.text_type_circle').contains(value).parent();
}

export function getTopElementOfValue(mainValue: string) {
    return cy.get('.text_type_circle').contains(mainValue).parent().parent().find('[class*=circle_head]');
}

export function getBottomElementOfValue(mainValue: string) {
    return cy.get('.text_type_circle').contains(mainValue).parent().parent().find('[class*=circle_tail]')
}

export function getElementIndexByValue(value: string) {
    return cy.get('.text_type_circle').contains(value).parent().parent().find('[class*=circle_index]');
}

export function getEmptyElementByIndex(index: number) {
    return cy.get('[class*=circle_index]').contains(index.toString()).prev();
}