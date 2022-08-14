// constants
import { ModuleActionTypes } from './constants';

export interface ModuleActionType {
    type:
    | ModuleActionTypes.API_RESPONSE_SUCCESS
    | ModuleActionTypes.API_RESPONSE_ERROR
    | ModuleActionTypes.MODULE_LIST
    | ModuleActionTypes.MODULE_CREATE
    | ModuleActionTypes.MODULE_UPDATE
    | ModuleActionTypes.MODULE_DELETE
    | ModuleActionTypes.MODULE_UPDATE_STATUS
    | ModuleActionTypes.RESET;
    payload: {} | string;
}

interface ModuleData {
    id? : number;
    adminId? : number;
    parentId? : number;
    childId? : number;
    menu_name: string;
    is_menu: number;
    sidebarName: string;
    position: number;
}

// common success
export const moduleApiResponseSuccess = (actionType: string, data: ModuleData | {}): ModuleActionType => ({
    type: ModuleActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const moduleApiResponseError = (actionType: string, error: string): ModuleActionType => ({
    type: ModuleActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const moduleList = (): ModuleActionType => ({
    type: ModuleActionTypes.MODULE_LIST,
    payload: { },
});

export const moduleCreate = (formData : ModuleData): ModuleActionType => ({
    type: ModuleActionTypes.MODULE_CREATE,
    payload: { formData },
});

export const moduleUpdate = (formData : ModuleData): ModuleActionType => ({
    type: ModuleActionTypes.MODULE_UPDATE,
    payload: { formData },
});

export const moduleDelete = (adminId : number, parentId : number, childId : any = null): ModuleActionType => ({
    type: ModuleActionTypes.MODULE_DELETE,
    payload: { adminId, parentId, childId },
});

export const moduleUpdateStatus = (adminId : number, parentId : number, childId : any = null, status : number): ModuleActionType => ({
    type: ModuleActionTypes.MODULE_UPDATE_STATUS,
    payload: { adminId, parentId, childId, status },
});

export const resetModule = (): ModuleActionType => ({
    type: ModuleActionTypes.RESET,
    payload: {},
});
