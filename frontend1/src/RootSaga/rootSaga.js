import { all } from 'redux-saga/effects';
import  loginSaga from '../sagas/loginSaga';
import signupSaga from '../sagas/signupSaga'

export default function* rootSaga() {
  yield all([
    loginSaga(),
    signupSaga(),
  ]);
}
