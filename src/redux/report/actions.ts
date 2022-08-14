// constants
import { ReportActionTypes } from './constants';

export interface ReportActionType {
    type:
    | ReportActionTypes.API_RESPONSE_SUCCESS
    | ReportActionTypes.API_RESPONSE_ERROR
    | ReportActionTypes.REPORT_GAME_TOWL
    | ReportActionTypes.REPORT_PLAYER_TOWL
    | ReportActionTypes.RESET;
    payload: {} | string;
}

interface ReportData {
    id? : number;
    adminId? : number;
    cluster_name: string;
    towl_date: string;
    data_name: string;
    turnover: string;
    winloss: string;
}

interface ReportFormData {
    clusters: string[];
    dateFrom: string;
    dateTo: string;
    reportType: string;
}

// common success
export const reportApiResponseSuccess = (actionType: string, data: ReportData | {}): ReportActionType => ({
    type: ReportActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const reportApiResponseError = (actionType: string, error: string): ReportActionType => ({
    type: ReportActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const reportGameTowlList = (formData : ReportFormData): ReportActionType => ({
    type: ReportActionTypes.REPORT_GAME_TOWL,
    payload: { formData },
});

export const reportPlayerTowlList = (formData : ReportFormData): ReportActionType => ({
    type: ReportActionTypes.REPORT_PLAYER_TOWL,
    payload: { formData },
});

export const resetReport = (): ReportActionType => ({
    type: ReportActionTypes.RESET,
    payload: {},
});
