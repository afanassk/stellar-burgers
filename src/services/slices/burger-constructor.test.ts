import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor,
  initialState,
  TConstructorState
} from './burger-constructor';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('burgerConstructor slice', () => {
  const bunIngredient: TIngredient = {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'bun.png',
    image_mobile: 'bun-m.png',
    image_large: 'bun-l.png'
  };

  const mainIngredient: TIngredient = {
    _id: 'main-1',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'main.png',
    image_mobile: 'main-m.png',
    image_large: 'main-l.png'
  };

  it('Добавление булки: bun устанавливается, ingredients не меняется', () => {
    const nextState = reducer(initialState, addIngredient(bunIngredient));

    expect(nextState.bun).toMatchObject(bunIngredient);
    expect(nextState.bun?.id).toBeDefined();
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('Добавление ингредиента (начинки): добавляется в ingredients и получает id', () => {
    const nextState = reducer(initialState, addIngredient(mainIngredient));

    expect(nextState.bun).toBeNull();
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toMatchObject(mainIngredient);
    expect(nextState.ingredients[0].id).toBeDefined();
  });

  it('Удаление ингредиента: удаляется по id', () => {
    const ing1: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '1'
    };
    const ing2: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '2'
    };

    const state: TConstructorState = {
      ...initialState,
      ingredients: [ing1, ing2]
    };

    const nextState = reducer(state, removeIngredient(ing1));

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0].id).toBe('2');
  });

  it('Перемещение начинки вверх: moveIngredientUp меняет порядок', () => {
    const ing1: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '1'
    };
    const ing2: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '2'
    };
    const ing3: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '3'
    };

    const state: TConstructorState = {
      ...initialState,
      ingredients: [ing1, ing2, ing3]
    };

    // поднимаем элемент с индексом 2 на позицию выше: [1,3,2]
    const nextState = reducer(state, moveIngredientUp(2));

    expect(nextState.ingredients.map((i) => i.id)).toEqual(['1', '3', '2']);
  });

  it('Перемещение начинки вниз: moveIngredientDown меняет порядок', () => {
    const ing1: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '1'
    };
    const ing2: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '2'
    };
    const ing3: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '3'
    };

    const state: TConstructorState = {
      ...initialState,
      ingredients: [ing1, ing2, ing3]
    };

    // опускаем элемент с индексом 0 вниз: [2,1,3]
    const nextState = reducer(state, moveIngredientDown(0));

    expect(nextState.ingredients.map((i) => i.id)).toEqual(['2', '1', '3']);
  });

  it('Границы перемещения: moveIngredientUp(0) не меняет порядок', () => {
    const ing1: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '1'
    };
    const ing2: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '2'
    };

    const state: TConstructorState = {
      ...initialState,
      ingredients: [ing1, ing2]
    };

    const nextState = reducer(state, moveIngredientUp(0));

    expect(nextState.ingredients.map((i) => i.id)).toEqual(['1', '2']);
  });

  it('Границы перемещения: moveIngredientDown(last) не меняет порядок', () => {
    const ing1: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '1'
    };
    const ing2: TConstructorIngredient = {
      ...(mainIngredient as any),
      id: '2'
    };

    const state: TConstructorState = {
      ...initialState,
      ingredients: [ing1, ing2]
    };

    const nextState = reducer(state, moveIngredientDown(1));

    expect(nextState.ingredients.map((i) => i.id)).toEqual(['1', '2']);
  });

  it('resetConstructor: сбрасывает состояние к initialState', () => {
    const state: TConstructorState = {
      ...initialState,
      bun: { ...(bunIngredient as any), id: 'bun-id' },
      ingredients: [{ ...(mainIngredient as any), id: '1' }],
      orderRequest: true,
      orderModalData: { number: 123 } as any,
      error: 'err'
    };

    const nextState = reducer(state, resetConstructor());

    expect(nextState).toEqual(initialState);
  });
});
