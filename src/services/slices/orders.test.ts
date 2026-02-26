import {
  orderSlice,
  initialState,
  createOrder,
  fetchOrders,
  getOrderById
} from './orders';
import { TOrder } from '@utils-types';

const reducer = orderSlice.reducer;

describe('Обработка экшенов orders slice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    number: 128,
    name: 'Тестовый заказ',
    status: 'done',
    ingredients: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  };

  const mockOrders: TOrder[] = [mockOrder];

  it('createOrder Request', () => {
    const state = reducer(initialState, createOrder.pending('req', ['1', '2']));

    expect(state.loading).toBe(true);
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('createOrder Success', () => {
    const state = reducer(
      { ...initialState, loading: true, orderRequest: true },
      createOrder.fulfilled({ order: mockOrder, name: mockOrder.name }, 'req', [
        '1',
        '2'
      ])
    );

    expect(state.loading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.orders).toContain(mockOrder);
  });

  it('createOrder Failed: ошибка из payload (rejectWithValue)', () => {
    const state = reducer(
      { ...initialState, loading: true, orderRequest: true },
      { type: createOrder.rejected.type, payload: 'Ошибка создания' }
    );

    expect(state.loading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка создания');
  });

  it('createOrder Failed: если payload отсутствует — берётся action.error.message', () => {
    const state = reducer(
      { ...initialState, loading: true, orderRequest: true },
      { type: createOrder.rejected.type, error: { message: 'fail' } }
    );

    expect(state.loading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('fail');
  });

  it('getOrderById Request', () => {
    const state = reducer(initialState, getOrderById.pending('req', 123));

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getOrderById Success', () => {
    const state = reducer(
      { ...initialState, loading: true },
      getOrderById.fulfilled(mockOrder, 'req', 123)
    );

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual([mockOrder]);
  });

  it('getOrderById Failed', () => {
    const state = reducer(
      { ...initialState, loading: true },
      getOrderById.rejected(
        new Error('fail'),
        'req',
        123,
        'Ошибка получения заказа'
      )
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка получения заказа');
  });

  it('fetchOrders Request', () => {
    const state = reducer(initialState, fetchOrders.pending('req', undefined));

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchOrders Success', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchOrders.fulfilled(mockOrders, 'req', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
  });

  it('fetchOrders Failed', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchOrders.rejected(
        new Error('fail'),
        'req',
        undefined,
        'Ошибка получения заказов'
      )
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка получения заказов');
  });

  it('clearOrderModal сброс данных', () => {
    const state = reducer(
      { ...initialState, orderModalData: mockOrder },
      orderSlice.actions.clearOrderModal()
    );

    expect(state.orderModalData).toBeNull();
  });
});
