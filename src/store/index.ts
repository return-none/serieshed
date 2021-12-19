import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import seriesReducer from 'store/series';

export const store = configureStore({
  reducer: {
    series: seriesReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
