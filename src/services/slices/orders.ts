import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';
import { resetConstructor } from './burger-constructor';

type TOrderState = {
  orders: TOrder[];
  orderModalData: TOrder | null;
  orderRequest: boolean;
  loading: boolean;
  error: string | null | undefined;
};

export const initialState: TOrderState = {
  orders: [],
  loading: false,
  error: null,
  orderModalData: null,
  orderRequest: false
};

export const createOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[],
  { rejectValue: string; state: RootState }
>('orders/createOrder', async (ingredients, { rejectWithValue, dispatch }) => {
  try {
    const createdOrder = await orderBurgerApi(ingredients);

    // Очищаем конструктор только после успешного создания заказа
    dispatch(resetConstructor());

    return { order: createdOrder.order, name: createdOrder.name };
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка при создании заказа');
  }
});

export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/getOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка при получении заказов');
  }
});

export const getOrderById = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/getOrderById', async (id, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(id);
    return response.orders[0];
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка при получении заказа по ID');
  }
});

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModal(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.orders.push(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.payload ?? action.error.message;
      });

    builder
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [action.payload];
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message;
      });
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [...action.payload];
      });
  }
});

export const getOrders = (state: RootState) => state.orders.orders;
export const getOrderModalData = (state: RootState) =>
  state.orders.orderModalData;
export const getOrderRequest = (state: RootState) => state.orders.orderRequest;
export const getOrderLoading = (state: RootState) => state.orders.loading;

export const { clearOrderModal } = orderSlice.actions;
