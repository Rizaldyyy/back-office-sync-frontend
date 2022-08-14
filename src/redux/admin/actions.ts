// constants
import { AdminActionTypes } from './constants';

export interface AdminActionType {
    type:
    | AdminActionTypes.API_RESPONSE_SUCCESS
    | AdminActionTypes.API_RESPONSE_ERROR
    | AdminActionTypes.ADMIN_LIST
    | AdminActionTypes.ADMIN_CREATE
    | AdminActionTypes.ADMIN_UPDATE
    | AdminActionTypes.ADMIN_DELETE
    | AdminActionTypes.ADMIN_LOCATION
    | AdminActionTypes.ADMIN_LOGS
    | AdminActionTypes.ADMIN_UPDATE_STATUS
    | AdminActionTypes.ADMIN_CHANGEPASSWORD
    | AdminActionTypes.RESET;
    payload: {} | string;
}

interface AdminData {
    id?: number;
    username: string;
    password: string;
    password_confirmation: string;
    group_id: number | string;
    location_id: number | string;
    change_password: boolean;
}

interface AdminChangePasswordData {
    id: number;
    password: string;
    new_password: string;
    new_password_confirmation: string;
}

// common success
export const adminApiResponseSuccess = (actionType: string, data: AdminData | {}): AdminActionType => ({
    type: AdminActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const adminApiResponseError = (actionType: string, error: string): AdminActionType => ({
    type: AdminActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const adminList = (): AdminActionType => ({
    type: AdminActionTypes.ADMIN_LIST,
    payload: { },
});

export const adminCreate = (formData : AdminData): AdminActionType => ({
    type: AdminActionTypes.ADMIN_CREATE,
    payload: { formData },
});

export const adminUpdate = (formData : AdminData): AdminActionType => ({
    type: AdminActionTypes.ADMIN_UPDATE,
    payload: { formData },
});

export const adminDelete = (adminId : number, id : number): AdminActionType => ({
    type: AdminActionTypes.ADMIN_DELETE,
    payload: { adminId, id },
});

export const adminUpdateStatus = (adminId : number, id : number, status : number): AdminActionType => ({
    type: AdminActionTypes.ADMIN_UPDATE_STATUS,
    payload: { adminId, id, status },
});

export const adminLogs = (cluster: string, admin: string, action: string, detail: string): AdminActionType => ({
    type: AdminActionTypes.ADMIN_LOGS,
    payload: { cluster, admin, action, detail },
});

export const adminLocation = (): AdminActionType => ({
    type: AdminActionTypes.ADMIN_LOCATION,
    payload: {  },
});

export const adminChangePassword = (formData : AdminChangePasswordData): AdminActionType => ({
    type: AdminActionTypes.ADMIN_CHANGEPASSWORD,
    payload: { formData },
});

export const resetAdmin = (): AdminActionType => ({
    type: AdminActionTypes.RESET,
    payload: {},
});
