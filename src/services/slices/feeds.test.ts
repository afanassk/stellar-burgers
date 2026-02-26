import { feedSlice, initialState, fetchFeeds, getOrderByNumber } from './feeds';
import { TOrder } from '@utils-types';

const reducer = feedSlice.reducer;

describe('Обработка экшенов feeds slice', () => {
  const orders: TOrder[] = [
    {
      _id: '1',
      number: 100,
      name: 'Тестовый заказ',
      status: 'done',
      ingredients: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    }
  ];

  it('fetchFeeds Request', () => {
    const state = reducer(
      initialState,
      fetchFeeds.pending('request-id', undefined)
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchFeeds Success', () => {
    const payload = { orders, total: 10, totalToday: 5 };

    const state = reducer(
      { ...initialState, loading: true },
      fetchFeeds.fulfilled(payload, 'request-id', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(orders);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(5);
  });

  it('fetchFeeds Failed: ошибка из payload (rejectWithValue)', () => {
    const state = reducer(
      { ...initialState, loading: true },
      { type: fetchFeeds.rejected.type, payload: 'Ошибка загрузки' }
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  it('fetchFeeds Failed: если payload отсутствует — берётся action.error.message', () => {
    const state = reducer(
      { ...initialState, loading: true },
      { type: fetchFeeds.rejected.type, error: { message: 'fail' } }
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('fail');
  });

  it('getOrderByNumber Request', () => {
    const state = reducer(
      initialState,
      getOrderByNumber.pending('request-id', 123)
    );

    expect(state.loading).toBe(true);
  });

  it('getOrderByNumber Success', () => {
    const state = reducer(
      { ...initialState, loading: true },
      getOrderByNumber.fulfilled({ orders }, 'request-id', 123)
    );

    expect(state.loading).toBe(false);
    expect(state.selectedOrder).toEqual(orders[0]);
  });

  it('getOrderByNumber Failed: ошибка из payload (rejectWithValue)', () => {
    const state = reducer(
      { ...initialState, loading: true },
      {
        type: getOrderByNumber.rejected.type,
        payload: 'Ошибка загрузки заказа'
      }
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказа');
  });

  it('getOrderByNumber Failed: если payload отсутствует — берётся action.error.message', () => {
    const state = reducer(
      { ...initialState, loading: true },
      { type: getOrderByNumber.rejected.type, error: { message: 'fail' } }
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('fail');
  });

  it('clearSelectedOrder очищает selectedOrder', () => {
    const state = reducer(
      { ...initialState, selectedOrder: orders[0] },
      feedSlice.actions.clearSelectedOrder()
    );

    expect(state.selectedOrder).toBeNull();
  });
});
