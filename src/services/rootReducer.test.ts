import { rootReducer } from './rootReducer';
import { ingredientsSlice } from './slices/ingredients';
import { constructorSlice } from './slices/burger-constructor';
import { orderSlice } from './slices/orders';
import { feedSlice } from './slices/feeds';
import { userSlice } from './slices/user';

describe('rootReducer', () => {
  it('Должен вернуть корректное начальное состояние при UNKNOWN_ACTION и undefined state', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('feeds');
    expect(state).toHaveProperty('user');

    expect(state.ingredients).toEqual(ingredientsSlice.getInitialState());
    expect(state.burgerConstructor).toEqual(constructorSlice.getInitialState());
    expect(state.orders).toEqual(orderSlice.getInitialState());
    expect(state.feeds).toEqual(feedSlice.getInitialState());
    expect(state.user).toEqual(userSlice.getInitialState());
  });
});
