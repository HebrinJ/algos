describe('routing is on', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })

  it('string page is available', () => {
    cy.get('a[href="/recursion"]').click();
    cy.contains('Строка');
  })

  it('fibonacci page is available', () => {
    cy.get('a[href="/fibonacci"]').click();
    cy.contains('Последовательность Фибоначчи');
  })

  it('sort page is available', () => {
    cy.get('a[href="/sorting"]').click();
    cy.contains('Сортировка массива');
  })

  it('stack page is available', () => {
    cy.get('a[href="/stack"]').click();
    cy.contains('Стек');
  })

  it('queue page is available', () => {
    cy.get('a[href="/queue"]').click();
    cy.contains('Очередь');
  })

  it('list page is available', () => {
    cy.get('a[href="/list"]').click();
    cy.contains('Связный список');
  })
})