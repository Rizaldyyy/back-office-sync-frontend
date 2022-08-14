// constants
import { RoleActionTypes } from './constants';

export interface RoleActionType {
    type:
    | RoleActionTypes.API_RESPONSE_SUCCESS
    | RoleActionTypes.API_RESPONSE_ERROR
    | RoleActionTypes.ROLE_LIST
    | RoleActionTypes.ROLE_CREATE
    | RoleActionTypes.ROLE_UPDATE
    | RoleActionTypes.ROLE_DELETE
    | RoleActionTypes.ROLE_UPDATE_STATUS
    | RoleActionTypes.RESET;
    payload: {} | string;
}

interface RoleData {
    id? : number;
    adminId? : number;
    name: string;
    module_roles: string[];
    cluster_roles: string[];
}

// common success
export const roleApiResponseSuccess = (actionType: string, data: RoleData | {}): RoleActionType => ({
    type: RoleActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const roleApiResponseError = (actionType: string, error: string): RoleActionType => ({
    type: RoleActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const roleList = (): RoleActionType => ({
    type: RoleActionTypes.ROLE_LIST,
    payload: { },
});

export const roleCreate = (formData : RoleData): RoleActionType => ({
    type: RoleActionTypes.ROLE_CREATE,
    payload: { formData },
});

export const roleUpdate = (formData : RoleData): RoleActionType => ({
    type: RoleActionTypes.ROLE_UPDATE,
    payload: { formData },
});

export const roleDelete = (adminId : number, id : number): RoleActionType => ({
    type: RoleActionTypes.ROLE_DELETE,
    payload: { adminId, id },
});

export const roleUpdateStatus = (adminId : number, id : number, status : number): RoleActionType => ({
    type: RoleActionTypes.ROLE_UPDATE_STATUS,
    payload: { adminId, id, status },
});

export const resetRole = (): RoleActionType => ({
    type: RoleActionTypes.RESET,
    payload: {},
});
