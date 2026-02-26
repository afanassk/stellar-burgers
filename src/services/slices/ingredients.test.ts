import {
  ingredientsSlice,
  initialState,
  fetchIngredients
} from './ingredients';
import { TIngredient } from '@utils-types';

const reducer = ingredientsSlice.reducer;

describe('Обработка экшенов ingredients slice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Тестовая булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 400,
      price: 500,
      image: 'image_url',
      image_mobile: 'image_mobile_url',
      image_large: 'image_large_url'
    }
  ];

  it('fetchIngredients Request', () => {
    const state = reducer(
      initialState,
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchIngredients Success', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchIngredients.fulfilled(mockIngredients, 'request-id', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('fetchIngredients Failed: берётся action.error.message', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchIngredients.rejected(new Error('fail'), 'request-id', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('fail');
  });
});
