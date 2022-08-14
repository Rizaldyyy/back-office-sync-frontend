import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

// helpers
import {
    reportGameTowlList as reportGameTowlListApi,
    reportPlayerTowlList as reportPlayerTowlListApi,
} from '../../helpers/api/report';

// actions
import { reportApiResponseSuccess, reportApiResponseError } from './actions';

// constants
import { ReportActionTypes } from './constants';

interface ReportData {
    payload: {
        clusters: string[];
        dateFrom: string;
        dateTo: string;
        reportType: string;
        formData: {};
    };
    type: string;
}

/**
 * Game TOWL List
 * @param {*} payload - name
 */
function* reportGameTowlList({ payload: { formData }, type }: ReportData): SagaIterator {
    try {
        const response = yield call(reportGameTowlListApi, { formData });
        const report = response.data.data;
        // NOTE - You can change this according to response format from your api
        yield put(reportApiResponseSuccess(ReportActionTypes.REPORT_GAME_TOWL, report));
    } catch (error: any) {
        yield put(reportApiResponseError(ReportActionTypes.REPORT_GAME_TOWL, error));
    }
}

/**
 * Player TOWL List
 * @param {*} payload - name
 */
 function* reportPlayerTowlList({ payload: { formData }, type }: ReportData): SagaIterator {
    try {
        const response = yield call(reportPlayerTowlListApi, { formData });
        const report = response.data.data;
        // NOTE - You can change this according to response format from your api
        yield put(reportApiResponseSuccess(ReportActionTypes.REPORT_PLAYER_TOWL, report));
    } catch (error: any) {
        yield put(reportApiResponseError(ReportActionTypes.REPORT_PLAYER_TOWL, error));
    }
}


export function* watchReportGameTowlList() {
    yield takeEvery(ReportActionTypes.REPORT_GAME_TOWL, reportGameTowlList);
}

export function* watchReportPlayerTowlList() {
    yield takeEvery(ReportActionTypes.REPORT_PLAYER_TOWL, reportPlayerTowlList);
}

function* reportSaga() {
    yield all([
        fork(watchReportGameTowlList), 
        fork(watchReportPlayerTowlList), 
    ]);
}

export default reportSaga;
