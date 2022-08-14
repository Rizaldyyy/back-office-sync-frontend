// constants
import { RoleActionTypes } from './constants';

const INIT_STATE = {
    loading: true,
    dataError: null,
    messageSuccess: null,
    messageError: null,
};

interface RoleActionType {
    type:
        | RoleActionTypes.API_RESPONSE_SUCCESS
        | RoleActionTypes.API_RESPONSE_ERROR
        | RoleActionTypes.ROLE_LIST
        | RoleActionTypes.ROLE_CREATE
        | RoleActionTypes.ROLE_UPDATE
        | RoleActionTypes.ROLE_DELETE
        | RoleActionTypes.ROLE_UPDATE_STATUS
        | RoleActionTypes.RESET;
    payload: {
        actionType?: string;
        data?: {};
        message: string;
        error?: string;
    };
}

interface State {
    data?: any;
    loading?: boolean;
    dataError?: any;
    messageError?: any;
    messageSuccess?: any;
    value?: boolean;
}

const Role = (state: State = INIT_STATE, action: RoleActionType): any => {
    switch (action.type) {
        case RoleActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case RoleActionTypes.ROLE_LIST: {
                    return {
                        ...state,
                        data: action.payload.data,
                        loading: false,
                    };
                }
                case RoleActionTypes.ROLE_CREATE: {
                    const param : any = action.payload.data;
                    const data = state.data?.concat(param.data);
                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case RoleActionTypes.ROLE_UPDATE: {
                    const param : any = action.payload.data;
                    const data = state.data.map((role : any) => {
                        return role.id === param.data.id ? param.data : role
                    });

                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case RoleActionTypes.ROLE_DELETE: {
                    const param : any = action.payload.data;
                    const data = state.data.filter((role : any) => role.id !== param.id)
                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case RoleActionTypes.ROLE_UPDATE_STATUS: {
                    const param : any = action.payload.data;
                    const data = state.data.map((role : any) => {
                        return role.id === param.id ? { ...role, active: param.status } : role
                    })

                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }

        case RoleActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case RoleActionTypes.ROLE_LIST: {
                    return {
                        ...state,
                        dataError: action.payload.error,
                        loading: false,
                    };
                }
                case RoleActionTypes.ROLE_CREATE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case RoleActionTypes.ROLE_UPDATE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case RoleActionTypes.ROLE_DELETE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case RoleActionTypes.ROLE_UPDATE_STATUS: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }
        case RoleActionTypes.ROLE_LIST:
            return { ...state, loading: true, dataError: null };
        case RoleActionTypes.ROLE_CREATE:
            return { ...state, loading: true, messageError: null, messageSuccess: null };
        case RoleActionTypes.ROLE_UPDATE:
            return { ...state, loading: true, messageError: null, messageSuccess: null };
        case RoleActionTypes.ROLE_DELETE:
            return { ...state, loading: false, messageError: null, messageSuccess: null };
        case RoleActionTypes.ROLE_UPDATE_STATUS:
            return { ...state, loading: false, messageError: null, messageSuccess: null };
        case RoleActionTypes.RESET:
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

export default Role;
