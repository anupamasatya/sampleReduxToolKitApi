import createSagaMiddleware from '@redux-saga/core';
import {configureStore, MiddlewareArray} from '@reduxjs/toolkit';
import homeReducer from '../app/Home/slice/index';
import {Middleware} from 'redux';
import rootSaga from '../sagas/index';
import authReducer from '../app/Auth/slice/index';
import {persistStore} from 'redux-persist';

const sagaMiddleware = createSagaMiddleware();

const middlewares: Middleware[] = [sagaMiddleware];

export const store = configureStore({
  reducer: {
    home: homeReducer,
    auth: authReducer,
  },
  middleware: new MiddlewareArray().concat(middlewares),
});
export const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
