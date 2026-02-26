export {};

declare global {
  namespace Cypress {
    interface Chainable {
      addIngredient(
        categoryTestId: string,
        ingredientName: string
      ): Chainable<void>;
      openIngredientModal(ingredientName: string): Chainable<void>;
      closeModal(method?: 'cross' | 'overlay' | 'esc'): Chainable<void>;
      loginWithMock(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('addIngredient', (categoryTestId, ingredientName) => {
  cy.get(`[data-testid="${categoryTestId}"]`)
    .contains(ingredientName)
    .parent()
    .find('button')
    .click();
});

Cypress.Commands.add('openIngredientModal', (ingredientName) => {
  cy.get(
    '[data-testid="ingredients-buns"], [data-testid="ingredients-mains"], [data-testid="ingredients-sauces"]'
  )
    .contains(ingredientName)
    .click();
  cy.get('[data-testid="modal"]').should('be.visible');
  cy.get('[data-testid="ingredient-name"]')
    .contains(ingredientName)
    .should('be.visible');
});

Cypress.Commands.add('closeModal', (method = 'cross') => {
  const modal = cy.get('[data-testid="modal"]');
  switch (method) {
    case 'cross':
      cy.get('[data-testid="close-modal"]').click();
      break;
    case 'overlay':
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      break;
    case 'esc':
      cy.get('body').type('{esc}');
      break;
  }

  cy.get('[data-testid="modal"]').should('not.exist');
});