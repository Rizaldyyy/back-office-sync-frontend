import { all } from 'redux-saga/effects';

import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import adminSaga from './admin/saga';
import roleSaga from './role/saga';
import clusterSaga from './cluster/saga';
import moduleSaga from './module/saga';
import reportSaga from './report/saga';

export default function* rootSaga() {
    yield all([authSaga(), layoutSaga(), adminSaga(), roleSaga(), clusterSaga(), moduleSaga(), reportSaga()]);
}
