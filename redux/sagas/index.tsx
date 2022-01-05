import {all, fork} from 'redux-saga/effects';
import watchUserRequest from '../app/Home/saga/index';

export default function* rootSaga() {
  yield all([fork(watchUserRequest)]);
}
