import {all, fork} from 'redux-saga/effects';
import watchUserRequest from '../../screens/Home/saga/index';

export default function* rootSaga() {
  yield all([fork(watchUserRequest)]);
}
