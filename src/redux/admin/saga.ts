import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

// helpers
import {
    adminList as adminListApi,
    adminCreate as adminCreateApi,
    adminUpdate as adminUpdateApi,
    adminDelete as adminDeleteApi,
    adminUpdateStatus as adminUpdateStatusApi,
    adminLogs as adminLogsApi,
    adminLocation as adminLocationApi,
    adminChangePassword as adminChangePasswordApi,
} from '../../helpers/api/admin';

// actions
import { adminApiResponseSuccess, adminApiResponseError } from './actions';

// constants
import { AdminActionTypes } from './constants';

interface AdminData {
    payload: {
        adminId: number;
        id: number;
        status: number;
        cluster: string;
        admin: string;
        username: string;
        group_id: number;
        location_id: number;
        action: string;
        detail: string;
        formData: {};
    };
    type: string;
}

/**
 * Admin List
 * @param {*} payload - username, group_id and location
 */
function* adminList({ payload: { username, group_id, location_id }, type }: AdminData): SagaIterator {
    try {
        const response = yield call(adminListApi, { username, group_id, location_id });
        const admin = response.data.data;
        // NOTE - You can change this according to response format from your api
        yield put(adminApiResponseSuccess(AdminActionTypes.ADMIN_LIST, admin));
    } catch (error: any) {
        yield put(adminApiResponseError(AdminActionTypes.ADMIN_LIST, error));
    }
}

/**
 * Admin Create
 * @param {*} payload - formData : username, password, password_confirmation, group_id, location and change_password
 */
 function* adminCreate({ payload: { formData }, type }: AdminData): SagaIterator {
    try {
        const response = yield call(adminCreateApi, { formData });
        const admin = response.data;
        // NOTE - You can change this according to response format from your api
        yield put(adminApiResponseSuccess(AdminActionTypes.ADMIN_CREATE, admin));
    } catch (error: any) {
        yield put(adminApiResponseError(AdminActionTypes.ADMIN_CREATE, error));
    }
}

/**
 * Admin Update
 * @param {*} payload - formData : id, username, password, password_confirmation, group_id, location and change_password
 */
 function* adminUpdate({ payload: { formData }, type }: AdminData): SagaIterator {
    try {
        const response = yield call(adminUpdateApi, { formData });
        const admin = response.data;
        // NOTE - You can change this according to response format from your api
        yield put(adminApiResponseSuccess(AdminActionTypes.ADMIN_UPDATE, admin));
    } catch (error: any) {
        yield put(adminApiResponseError(AdminActionTypes.ADMIN_UPDATE, error));
    }
}

/**
 * Admin Delete
 * @param {*} payload - adminId, id
 */
 function* adminDelete({ payload: { adminId, id }, type }: AdminData): SagaIterator {
    try {
        const response = yield call(adminDeleteApi, { adminId, id });
        const message = response.data.message;
        const admin = { id , message };
        // NOTE - You can change this according to response format from your api
        yield put(adminApiResponseSuccess(AdminActionTypes.ADMIN_DELETE, admin));
    } catch (error: any) {
        yield put(adminApiResponseError(AdminActionTypes.ADMIN_DELETE, error));
    }
}

/**
 * Update Admin Staus
 * @param {*} payload - adminId, id, status
 */
 function* adminUpdateStatus({ payload: { adminId, id, status }, type }: AdminData): SagaIterator {
    try {
        const response = yield call(adminUpdateStatusApi, { adminId, id, status });
        const message = response.data.message;
        const admin = { id, status , message };
        // NOTE - You can change this according to response format from your api
        yield put(adminApiResponseSuccess(AdminActionTypes.ADMIN_UPDATE_STATUS, admin));
    } catch (error: any) {
        yield put(adminApiResponseError(AdminActionTypes.ADMIN_UPDATE_STATUS, error));
    }
}

/**
 * Admin Logs
 * @param {*} payload - cluster, admin, action, detail
 */
 function* adminLogs({ payload: { cluster, admin, action, detail }, type }: AdminData): SagaIterator {
    try {
        const response = yield call(adminLogsApi, {cluster, admin, action, detail});
        const logs = response.data.data;
        // NOTE - You can change this according to response format from your api
        yield put(adminApiResponseSuccess(AdminActionTypes.ADMIN_LOGS, logs));
    } catch (error: any) {
        yield put(adminApiResponseError(AdminActionTypes.ADMIN_LOGS, error));
    }
}

/**
 * Admin Location
 * @param {*} payload - location_id
 */
 function* adminLocation({ payload: { location_id: number }, type }: AdminData): SagaIterator {
    try {
        const response = yield call(adminLocationApi, {});
        const location = response.data.data;
        // NOTE - You can change this according to response format from your api
        yield put(adminApiResponseSuccess(AdminActionTypes.ADMIN_LOCATION, location));
    } catch (error: any) {
        yield put(adminApiResponseError(AdminActionTypes.ADMIN_LOCATION, error));
    }
}

/**
 * Admin Change Password
 * @param {*} payload - formData : old_password, password and password_confirmation
 */
 function* adminChangePassword({ payload: { formData }, type }: AdminData): SagaIterator {
    try {
        const response = yield call(adminChangePasswordApi, { formData });
        const admin = response.data;
        // NOTE - You can change this according to response format from your api
        yield put(adminApiResponseSuccess(AdminActionTypes.ADMIN_CHANGEPASSWORD, admin));
    } catch (error: any) {
        yield put(adminApiResponseError(AdminActionTypes.ADMIN_CHANGEPASSWORD, error));
    }
}

export function* watchAdminList() {
    yield takeEvery(AdminActionTypes.ADMIN_LIST, adminList);
}

export function* watchAdminCreate() {
    yield takeEvery(AdminActionTypes.ADMIN_CREATE, adminCreate);
}

export function* watchAdminUpdate() {
    yield takeEvery(AdminActionTypes.ADMIN_UPDATE, adminUpdate);
}

export function* watchAdminDelete() {
    yield takeEvery(AdminActionTypes.ADMIN_DELETE, adminDelete);
}

export function* watchAdminUpdateStatus() {
    yield takeEvery(AdminActionTypes.ADMIN_UPDATE_STATUS, adminUpdateStatus);
}

export function* watchAdminLogs() {
    yield takeEvery(AdminActionTypes.ADMIN_LOGS, adminLogs);
}

export function* watchAdminLocation() {
    yield takeEvery(AdminActionTypes.ADMIN_LOCATION, adminLocation);
}

export function* watchAdminChangePassword() {
    yield takeEvery(AdminActionTypes.ADMIN_CHANGEPASSWORD, adminChangePassword);
}

function* adminSaga() {
    yield all([
        fork(watchAdminList), 
        fork(watchAdminCreate), 
        fork(watchAdminUpdate), 
        fork(watchAdminDelete), 
        fork(watchAdminUpdateStatus), 
        fork(watchAdminLogs), 
        fork(watchAdminLocation),
        fork(watchAdminChangePassword)
    ]);
}

export default adminSaga;
