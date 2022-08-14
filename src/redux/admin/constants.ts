export enum AdminActionTypes {
    API_RESPONSE_SUCCESS = '@@admin/API_RESPONSE_SUCCESS',
    API_RESPONSE_ERROR = '@@admin/API_RESPONSE_ERROR',

    ADMIN_LIST = '@@admin/ADMIN_LIST',
    ADMIN_CREATE = '@@admin/ADMIN_CREATE',
    ADMIN_UPDATE = '@@admin/ADMIN_UPDATE',
    ADMIN_DELETE = '@@admin/ADMIN_DELETE',
    ADMIN_UPDATE_STATUS = '@@admin/ADMIN_UPDATE_STATUS',
    ADMIN_CHANGEPASSWORD = '@@admin/ADMIN_CHANGEPASSWORD',

    ADMIN_LOGS = '@@admin/ADMIN_LOGS',
    
    ADMIN_LOCATION = '@@admin/ADMIN_LOCATION',

    RESET = '@@admin/RESET',
}