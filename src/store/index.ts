import {
  useDispatch,
  useSelector as useReduxSelector
} from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { ThunkAction } from 'redux-thunk';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { Action } from '@reduxjs/toolkit';
import LoadingReducer from './reducers/Loading';

export const rootReducer = combineReducers({
  loading: LoadingReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.REACT_APP_ENABLE_REDUX_DEV_TOOLS === 'true'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();
