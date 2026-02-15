import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredients';
import { constructorSlice } from './slices/burger-constructor';
import { orderSlice } from './slices/orders';
import { feedSlice } from './slices/feeds';
import { userSlice } from './slices/user';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
  orders: orderSlice.reducer,
  feeds: feedSlice.reducer,
  user: userSlice.reducer
});
