import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

// helpers
import {
    roleList as roleListApi,
    roleCreate as roleCreateApi,
    roleUpdate as roleUpdateApi,
    roleDelete as roleDeleteApi,
    roleUpdateStatus as roleUpdateStatusApi,
} from '../../helpers/api/role';

// actions
import { roleApiResponseSuccess, roleApiResponseError } from './actions';

// constants
import { RoleActionTypes } from './constants';

interface RoleData {
    payload: {
        id : number;
        adminId : number;
        name: string;
        api_url: string;
        role_url: string;
        status: number;
        formData: {};
    };
    type: string;
}

/**
 * Role List
 * @param {*} payload - name
 */
function* roleList({ payload: { name }, type }: RoleData): SagaIterator {
    try {
        const response = yield call(roleListApi, { name });
        const role = response.data.data;
        // NOTE - You can change this according to response format from your api
        yield put(roleApiResponseSuccess(RoleActionTypes.ROLE_LIST, role));
    } catch (error: any) {
        yield put(roleApiResponseError(RoleActionTypes.ROLE_LIST, error));
    }
}

/**
 * Role Create
 * @param {*} payload - formData : username, password, password_confirmation, group_id, location and change_password
 */
 function* roleCreate({ payload: { formData }, type }: RoleData): SagaIterator {
    try {
        const response = yield call(roleCreateApi, { formData });
        const role = response.data;
        // NOTE - You can change this according to response format from your api
        yield put(roleApiResponseSuccess(RoleActionTypes.ROLE_CREATE, role));
    } catch (error: any) {
        yield put(roleApiResponseError(RoleActionTypes.ROLE_CREATE, error));
    }
}

/**
 * Role Update
 * @param {*} payload - formData : id, username, password, password_confirmation, group_id, location and change_password
 */
 function* roleUpdate({ payload: { formData }, type }: RoleData): SagaIterator {
    try {
        const response = yield call(roleUpdateApi, { formData });
        const role = response.data;
        // NOTE - You can change this according to response format from your api
        yield put(roleApiResponseSuccess(RoleActionTypes.ROLE_UPDATE, role));
    } catch (error: any) {
        yield put(roleApiResponseError(RoleActionTypes.ROLE_UPDATE, error));
    }
}

/**
 * Role Delete
 * @param {*} payload - adminId, id
 */
 function* roleDelete({ payload: { adminId, id }, type }: RoleData): SagaIterator {
    try {
        const response = yield call(roleDeleteApi, { adminId, id });
        const message = response.data.message;
        const role = { id , message };
        // NOTE - You can change this according to response format from your api
        yield put(roleApiResponseSuccess(RoleActionTypes.ROLE_DELETE, role));
    } catch (error: any) {
        yield put(roleApiResponseError(RoleActionTypes.ROLE_DELETE, error));
    }
}

/**
 * Update role Staus
 * @param {*} payload - adminId, id, status
 */
 function* roleUpdateStatus({ payload: { adminId, id, status }, type }: RoleData): SagaIterator {
    try {
        const response = yield call(roleUpdateStatusApi, { adminId, id, status });
        const message = response.data.message;
        const role = { id, status , message };
        // NOTE - You can change this according to response format from your api
        yield put(roleApiResponseSuccess(RoleActionTypes.ROLE_UPDATE_STATUS, role));
    } catch (error: any) {
        yield put(roleApiResponseError(RoleActionTypes.ROLE_UPDATE_STATUS, error));
    }
}


export function* watchRoleList() {
    yield takeEvery(RoleActionTypes.ROLE_LIST, roleList);
}

export function* watchRoleCreate() {
    yield takeEvery(RoleActionTypes.ROLE_CREATE, roleCreate);
}

export function* watchRoleUpdate() {
    yield takeEvery(RoleActionTypes.ROLE_UPDATE, roleUpdate);
}

export function* watchRoleDelete() {
    yield takeEvery(RoleActionTypes.ROLE_DELETE, roleDelete);
}

export function* watchRoleUpdateStatus() {
    yield takeEvery(RoleActionTypes.ROLE_UPDATE_STATUS, roleUpdateStatus);
}

function* roleSaga() {
    yield all([
        fork(watchRoleList), 
        fork(watchRoleCreate), 
        fork(watchRoleUpdate), 
        fork(watchRoleDelete), 
        fork(watchRoleUpdateStatus),
    ]);
}

export default roleSaga;
