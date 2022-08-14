import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

// helpers
import {
    clusterList as clusterListApi,
    clusterCreate as clusterCreateApi,
    clusterUpdate as clusterUpdateApi,
    clusterDelete as clusterDeleteApi,
    clusterUpdateStatus as clusterUpdateStatusApi,
} from '../../helpers/api/cluster';

// actions
import { clusterApiResponseSuccess, clusterApiResponseError } from './actions';

// constants
import { ClusterActionTypes } from './constants';

interface ClusterData {
    payload: {
        id : number;
        adminId : number;
        name: string;
        api_url: string;
        cluster_url: string;
        status: number;
        formData: {};
    };
    type: string;
}

/**
 * Cluster List
 * @param {*} payload - name
 */
function* clusterList({ payload: { name }, type }: ClusterData): SagaIterator {
    try {
        const response = yield call(clusterListApi, { name });
        const cluster = response.data.data;
        // NOTE - You can change this according to response format from your api
        yield put(clusterApiResponseSuccess(ClusterActionTypes.CLUSTER_LIST, cluster));
    } catch (error: any) {
        yield put(clusterApiResponseError(ClusterActionTypes.CLUSTER_LIST, error));
    }
}

/**
 * Cluster Create
 * @param {*} payload - formData : username, password, password_confirmation, group_id, location and change_password
 */
 function* clusterCreate({ payload: { formData }, type }: ClusterData): SagaIterator {
    try {
        const response = yield call(clusterCreateApi, { formData });
        const cluster = response.data;
        // NOTE - You can change this according to response format from your api
        yield put(clusterApiResponseSuccess(ClusterActionTypes.CLUSTER_CREATE, cluster));
    } catch (error: any) {
        yield put(clusterApiResponseError(ClusterActionTypes.CLUSTER_CREATE, error));
    }
}

/**
 * Cluster Update
 * @param {*} payload - formData : id, username, password, password_confirmation, group_id, location and change_password
 */
 function* clusterUpdate({ payload: { formData }, type }: ClusterData): SagaIterator {
    try {
        const response = yield call(clusterUpdateApi, { formData });
        const cluster = response.data;
        // NOTE - You can change this according to response format from your api
        yield put(clusterApiResponseSuccess(ClusterActionTypes.CLUSTER_UPDATE, cluster));
    } catch (error: any) {
        yield put(clusterApiResponseError(ClusterActionTypes.CLUSTER_UPDATE, error));
    }
}

/**
 * Cluster Delete
 * @param {*} payload - adminId, id
 */
 function* clusterDelete({ payload: { adminId, id }, type }: ClusterData): SagaIterator {
    try {
        const response = yield call(clusterDeleteApi, { adminId, id });
        const message = response.data.message;
        const cluster = { id , message };
        // NOTE - You can change this according to response format from your api
        yield put(clusterApiResponseSuccess(ClusterActionTypes.CLUSTER_DELETE, cluster));
    } catch (error: any) {
        yield put(clusterApiResponseError(ClusterActionTypes.CLUSTER_DELETE, error));
    }
}

/**
 * Update cluster Staus
 * @param {*} payload - adminId, id, status
 */
 function* clusterUpdateStatus({ payload: { adminId, id, status }, type }: ClusterData): SagaIterator {
    try {
        const response = yield call(clusterUpdateStatusApi, { adminId, id, status });
        const message = response.data.message;
        const cluster = { id, status , message };
        // NOTE - You can change this according to response format from your api
        yield put(clusterApiResponseSuccess(ClusterActionTypes.CLUSTER_UPDATE_STATUS, cluster));
    } catch (error: any) {
        yield put(clusterApiResponseError(ClusterActionTypes.CLUSTER_UPDATE_STATUS, error));
    }
}


export function* watchClusterList() {
    yield takeEvery(ClusterActionTypes.CLUSTER_LIST, clusterList);
}

export function* watchClusterCreate() {
    yield takeEvery(ClusterActionTypes.CLUSTER_CREATE, clusterCreate);
}

export function* watchClusterUpdate() {
    yield takeEvery(ClusterActionTypes.CLUSTER_UPDATE, clusterUpdate);
}

export function* watchClusterDelete() {
    yield takeEvery(ClusterActionTypes.CLUSTER_DELETE, clusterDelete);
}

export function* watchClusterUpdateStatus() {
    yield takeEvery(ClusterActionTypes.CLUSTER_UPDATE_STATUS, clusterUpdateStatus);
}

function* clusterSaga() {
    yield all([
        fork(watchClusterList), 
        fork(watchClusterCreate), 
        fork(watchClusterUpdate), 
        fork(watchClusterDelete), 
        fork(watchClusterUpdateStatus),
    ]);
}

export default clusterSaga;
