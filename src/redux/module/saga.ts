import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

// helpers
import {
    moduleList as moduleListApi,
    moduleCreate as moduleCreateApi,
    moduleUpdate as moduleUpdateApi,
    moduleDelete as moduleDeleteApi,
    moduleUpdateStatus as moduleUpdateStatusApi,
} from '../../helpers/api/module';

// actions
import { moduleApiResponseSuccess, moduleApiResponseError } from './actions';

// constants
import { ModuleActionTypes } from './constants';

interface ModuleData {
    payload: {
        id : number;
        adminId : number;
        parentId : number;
        childId : number;
        name: string;
        is_menu: number;
        sidebarName: string;
        position: string;
        status: number;
        formData: {};
    };
    type: string;
}

/**
 * Module List
 * @param {*} payload - name
 */
function* moduleList({ payload: { name }, type }: ModuleData): SagaIterator {
    try {
        const response = yield call(moduleListApi, { name });
        const module = response.data.data;
        // NOTE - You can change this according to response format from your api
        yield put(moduleApiResponseSuccess(ModuleActionTypes.MODULE_LIST, module));
    } catch (error: any) {
        yield put(moduleApiResponseError(ModuleActionTypes.MODULE_LIST, error));
    }
}

/**
 * Module Create
 * @param {*} payload - formData
 */
 function* moduleCreate({ payload: { formData }, type }: ModuleData): SagaIterator {
    try {
        const response = yield call(moduleCreateApi, { formData });
        console.log(response);
        const moduleData = response.data;
        // NOTE - You can change this according to response format from your api
        yield put(moduleApiResponseSuccess(ModuleActionTypes.MODULE_CREATE, moduleData));
    } catch (error: any) {
        console.log(error);
        yield put(moduleApiResponseError(ModuleActionTypes.MODULE_CREATE, error));
    }
}

/**
 * Module Update
 * @param {*} payload - formData
 */
 function* moduleUpdate({ payload: { formData }, type }: ModuleData): SagaIterator {
    try {
        const response = yield call(moduleUpdateApi, { formData });
        const module = response.data;
        // NOTE - You can change this according to response format from your api
        yield put(moduleApiResponseSuccess(ModuleActionTypes.MODULE_UPDATE, module));
    } catch (error: any) {
        yield put(moduleApiResponseError(ModuleActionTypes.MODULE_UPDATE, error));
    }
}

/**
 * Module Delete
 * @param {*} payload - adminId, parentId, childId
 */
 function* moduleDelete({ payload: { adminId, parentId, childId }, type }: ModuleData): SagaIterator {
    try {
        const id = childId;
        const response = yield call(moduleDeleteApi, { adminId, id });
        const message = response.data.message;
        const module = { parentId, message, childId };
        // NOTE - You can change this according to response format from your api
        yield put(moduleApiResponseSuccess(ModuleActionTypes.MODULE_DELETE, module));
    } catch (error: any) {
        yield put(moduleApiResponseError(ModuleActionTypes.MODULE_DELETE, error));
    }
}

/**
 * Update module Staus
 * @param {*} payload - adminId, parentId, childId status
 */
 function* moduleUpdateStatus({ payload: { adminId, parentId, childId, status }, type }: ModuleData): SagaIterator {
    try {
        const id = childId;
        const response = yield call(moduleUpdateStatusApi, { adminId, id, status });
        const message = response.data.message;
        const module = { parentId, childId, status, message };
        // NOTE - You can change this according to response format from your api
        yield put(moduleApiResponseSuccess(ModuleActionTypes.MODULE_UPDATE_STATUS, module));
    } catch (error: any) {
        yield put(moduleApiResponseError(ModuleActionTypes.MODULE_UPDATE_STATUS, error));
    }
}


export function* watchModuleList() {
    yield takeEvery(ModuleActionTypes.MODULE_LIST, moduleList);
}

export function* watchModuleCreate() {
    yield takeEvery(ModuleActionTypes.MODULE_CREATE, moduleCreate);
}

export function* watchModuleUpdate() {
    yield takeEvery(ModuleActionTypes.MODULE_UPDATE, moduleUpdate);
}

export function* watchModuleDelete() {
    yield takeEvery(ModuleActionTypes.MODULE_DELETE, moduleDelete);
}

export function* watchModuleUpdateStatus() {
    yield takeEvery(ModuleActionTypes.MODULE_UPDATE_STATUS, moduleUpdateStatus);
}

function* moduleSaga() {
    yield all([
        fork(watchModuleList), 
        fork(watchModuleCreate), 
        fork(watchModuleUpdate), 
        fork(watchModuleDelete), 
        fork(watchModuleUpdateStatus),
    ]);
}

export default moduleSaga;
