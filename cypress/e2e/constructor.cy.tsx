describe('Интеграционные тесты для страницы конструктора', () => {
  beforeEach('Настроен перехват запроса на эндпоинт api/ingredients', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach('Очистка cookies и localStorage', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Добавление булки, начинки и соуса', () => {
    cy.addIngredient('ingredients-buns', 'Краторная булка N-200i');
    cy.addIngredient('ingredients-mains', 'Биокотлета из марсианской Магнолии');
    cy.addIngredient('ingredients-sauces', 'Соус Spicy-X'); // ✅ соусы
  });

  it('Открытие модалки ингредиента, проверка данных и закрытие по крестику', () => {
    const ingredientName = 'Краторная булка N-200i';

    cy.openIngredientModal(ingredientName);
    cy.get('[data-testid="ingredient-name"]').should('contain.text', ingredientName);

    cy.closeModal('cross');
  });

  it('Закрытие модалки по клику на оверлей', () => {
    const ingredient = 'Биокотлета из марсианской Магнолии';
    cy.openIngredientModal(ingredient);
    cy.closeModal('overlay');
  });

  it('Закрытие модалки по нажатию Esc', () => {
    const ingredient = 'Соус Spicy-X';
    cy.openIngredientModal(ingredient);
    cy.closeModal('esc');
  });

  it('Создание заказа', () => {
    // Токены
    cy.fixture('login.json').then((loginData) => {
      cy.setCookie('accessToken', loginData.accessToken);
      cy.setCookie('refreshToken', loginData.refreshToken);
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', loginData.accessToken);
        win.localStorage.setItem('refreshToken', loginData.refreshToken);
      });
    });

    // Мок ответа на запрос данных пользователя
    cy.fixture('user.json').then((userData) => {
      cy.intercept('GET', '**/api/auth/user', { statusCode: 200, body: userData })
        .as('getUser');
    });

    // Мок ответа на запрос создания заказа
    cy.fixture('order.json').then((response) => {
      cy.intercept('POST', '**/api/orders', { statusCode: 200, body: response })
        .as('createOrder');
    });

    cy.visit('/');

    // Собираем бургер
    cy.addIngredient('ingredients-buns', 'Краторная булка N-200i');
    cy.addIngredient('ingredients-mains', 'Биокотлета из марсианской Магнолии');
    cy.addIngredient('ingredients-sauces', 'Соус Spicy-X'); // ✅ соусы

    // Оформляем заказ
    cy.get('button').contains('Оформить заказ').click();

    // Проверка открытия модального окна
    cy.get('[data-testid="modal"]').should('be.visible');

    // Проверка номера заказа
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.fixture('order.json').then((orderData) => {
      cy.get('[data-testid="order-number"]').should(
        'contain.text',
        orderData.order.number
      );
    });

    // Проверка закрытия модального окна
    cy.closeModal('cross');

    // Проверка очистки конструктора
    cy.contains('Выберите булки').should('exist');
    cy.get('[data-testid="burger-constructor"]').should(
      'contain.text',
      'Выберите начинку'
    );
    cy.get('[data-testid="burger-constructor"] li').should('have.length', 0);
  });
});