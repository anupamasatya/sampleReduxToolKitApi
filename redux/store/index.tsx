import createSagaMiddleware from '@redux-saga/core';
import {configureStore, MiddlewareArray} from '@reduxjs/toolkit';
import homeReducer from '../app/Home/slice/index';
import {Middleware} from 'redux';
import rootSaga from '../sagas/index';

const sagaMiddleware = createSagaMiddleware();

const middlewares: Middleware[] = [sagaMiddleware];

export const store = configureStore({
  reducer: {
    home: homeReducer,
  },
  middleware: new MiddlewareArray().concat(middlewares),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
