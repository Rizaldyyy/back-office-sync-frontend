// constants
import { AdminActionTypes } from './constants';

const INIT_STATE = {
    loading: true,
    dataError: null,
    messageSuccess: null,
    messageError: null,
};

interface AdminActionType {
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
    payload: {
        actionType?: string;
        data?: {};
        logs?: {};
        message: string;
        error?: string;
    };
}

interface State {
    data?: any;
    logs?: {};
    location?: {};
    loading?: boolean;
    dataError?: any;
    messageError?: any;
    messageSuccess?: any;
    value?: boolean;
}

const Admin = (state: State = INIT_STATE, action: AdminActionType): any => {
    switch (action.type) {
        case AdminActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case AdminActionTypes.ADMIN_LIST: {
                    return {
                        ...state,
                        data: action.payload.data,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_CREATE: {
                    const param : any = action.payload.data;
                    const data = state.data?.concat(param.data);
                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_UPDATE: {
                    const param : any = action.payload.data;
                    const data = state.data.map((admin : any) => {
                        return admin.id === param.data.id ? param.data : admin
                    });

                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_DELETE: {
                    const param : any = action.payload.data;
                    const data = state.data.filter((admin : any) => admin.id !== param.id)
                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_UPDATE_STATUS: {
                    const param : any = action.payload.data;
                    const data = state.data.map((admin : any) => {
                        return admin.id === param.id ? { ...admin, status: param.status } : admin
                    })

                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_LOGS: {
                    return {
                        ...state,
                        logs: action.payload.data,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_LOCATION: {
                    return {
                        ...state,
                        location: action.payload.data,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_CHANGEPASSWORD: {
                    const param : any = action.payload.data;
                    return {
                        ...state,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }

        case AdminActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case AdminActionTypes.ADMIN_LIST: {
                    return {
                        ...state,
                        dataError: action.payload.error,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_CREATE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_UPDATE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_DELETE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_UPDATE_STATUS: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_LOGS: {
                    return {
                        ...state,
                        dataError: action.payload.error,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_LOCATION: {
                    return {
                        ...state,
                        dataError: action.payload.error,
                        loading: false,
                    };
                }
                case AdminActionTypes.ADMIN_CHANGEPASSWORD: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }
        case AdminActionTypes.ADMIN_LIST:
            return { ...state, loading: true, dataError: null };
        case AdminActionTypes.ADMIN_CREATE:
            return { ...state, loading: true, messageError: null, messageSuccess: null };
        case AdminActionTypes.ADMIN_UPDATE:
            return { ...state, loading: true, messageError: null, messageSuccess: null };
        case AdminActionTypes.ADMIN_DELETE:
            return { ...state, loading: false, messageError: null, messageSuccess: null };
        case AdminActionTypes.ADMIN_UPDATE_STATUS:
            return { ...state, loading: false, messageError: null, messageSuccess: null };
        case AdminActionTypes.ADMIN_LOGS:
            return { ...state, loading: true, dataError: null };
        case AdminActionTypes.ADMIN_LOCATION:
            return { ...state, loading: true, dataError: null };
        case AdminActionTypes.ADMIN_CHANGEPASSWORD:
            return { ...state, loading: false, messageError: null, messageSuccess: null };
        case AdminActionTypes.RESET:
            return {
                ...state,
                dataError: null,
                messageError: null,
                messageSuccess: null,
            };
        default:
            return { ...state };
    }
};

export default Admin;
