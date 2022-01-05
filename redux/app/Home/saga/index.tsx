import {call, put, SagaReturnType, takeLatest} from '@redux-saga/core/effects';
import {PayloadAction} from '@reduxjs/toolkit';
import {AxiosProps} from '../../../type';

import {AxiosResponse} from 'axios';
import {requestApi} from '../../../../config/axios';
import {} from '../../../types/index';
import {userDataReq, userSuccess, userError} from '../slice/index';

function* getUserData(_action: PayloadAction<any>): SagaReturnType<any> {
  try {
    // const userAuthPayload = action.payload;

    const requestParams: AxiosProps = {
      type: 'GET',
      url: '/products/category/jewelery',
      //params: userAuthPayload,
    };

    const response: AxiosResponse = yield call(requestApi, requestParams);
    console.log('response in saga', response);

    const {data, status} = response;
    console.log('data in saga', data);
    if (status === 200 && data) {
      yield put(userSuccess({Data: response.data}));
    } else {
      yield put(userError({error: response.data}));
    }
  } catch (error) {
    yield put(userError({error: 'Server Error'}));
  }
}

export default function* watchUserRequest() {
  yield takeLatest(userDataReq, getUserData);
}
