// constants
import { ModuleActionTypes } from './constants';

const INIT_STATE = {
    loading: true,
    dataError: null,
    messageSuccess: null,
    messageError: null,
};

interface ModuleActionType {
    type:
        | ModuleActionTypes.API_RESPONSE_SUCCESS
        | ModuleActionTypes.API_RESPONSE_ERROR
        | ModuleActionTypes.MODULE_LIST
        | ModuleActionTypes.MODULE_CREATE
        | ModuleActionTypes.MODULE_UPDATE
        | ModuleActionTypes.MODULE_DELETE
        | ModuleActionTypes.MODULE_UPDATE_STATUS
        | ModuleActionTypes.RESET;
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

const Module = (state: State = INIT_STATE, action: ModuleActionType): any => {
    switch (action.type) {
        case ModuleActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case ModuleActionTypes.MODULE_LIST: {
                    return {
                        ...state,
                        data: action.payload.data,
                        loading: false,
                    };
                }
                case ModuleActionTypes.MODULE_CREATE: {
                    const param : any = action.payload.data;
                    let data = state.data;

                    // if the data is parent or child
                    const parent = data.filter((module : any) => module.id === param.data.module_parent);
                    if (parent.length > 0) {
                        // filter the child of parent
                        const newParent = parent[0].child.concat(param.data);
                        
                        // re-assign the child of parent
                        data = data.map((module : any) => { return module.id === param.data.module_parent ? newParent : module });
                    }else{
                        data = data.concat(param.data);
                    }

                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case ModuleActionTypes.MODULE_UPDATE: {
                    const param : any = action.payload.data;
                    let data = state.data;

                    // if the data is parent or child
                    const parent = data.filter((module : any) => module.id === param.data.module_parent);
                    if (parent.length > 0) {
                        // filter the child of parent
                        const children = parent[0].child.map((child : any) => {
                            return child.id === param.data.id ? param.data : child
                        });
                        // re-assign the child of parent
                        data = data.map((module : any) => { return module.id === param.data.module_parent ? { ...module, child: children } : module });
                    }else{
                        data = data.map((module : any) => {
                            return module.id === param.data.id ? param.data : module
                        });
                    }

                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case ModuleActionTypes.MODULE_DELETE: {
                    const param : any = action.payload.data;
                    let data = state.data;

                    // if the data is parent or child
                    const parent = data.filter((module : any) => module.id === param.parentId);
                    if (parent.length > 0) {
                        // filter the child of parent
                        const children = parent[0].child.filter((child : any) => child.id !== param.childId);
                        // re-assign the child of parent
                        data = data.map((module : any) => { return module.id === param.parentId ? { ...module, child: children } : module });
                    }else{
                        data = data.filter((module : any) => module.id !== param.childId);
                    }

                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case ModuleActionTypes.MODULE_UPDATE_STATUS: {
                    const param : any = action.payload.data;
                    let data = state.data;

                    // if the data is parent or child
                    const parent = data.filter((module : any) => module.id === param.parentId);
                    if (parent.length > 0) {
                        // filter the child of parent
                        const children = parent[0].child.map((child : any) => {
                            return child.id === param.childId ? { ...child, active: param.status } : child
                        });
                        // re-assign the child of parent
                        data = data.map((module : any) => { return module.id === param.parentId ? { ...module, child: children } : module });
                    }else{
                        data = data.map((module : any) => {
                            return module.id === param.childId ? { ...module, active: param.status } : module
                        });
                    }

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

        case ModuleActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case ModuleActionTypes.MODULE_LIST: {
                    return {
                        ...state,
                        dataError: action.payload.error,
                        loading: false,
                    };
                }
                case ModuleActionTypes.MODULE_CREATE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case ModuleActionTypes.MODULE_UPDATE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case ModuleActionTypes.MODULE_DELETE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case ModuleActionTypes.MODULE_UPDATE_STATUS: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }
        case ModuleActionTypes.MODULE_LIST:
            return { ...state, loading: true, dataError: null };
        case ModuleActionTypes.MODULE_CREATE:
            return { ...state, loading: true, messageError: null, messageSuccess: null };
        case ModuleActionTypes.MODULE_UPDATE:
            return { ...state, loading: true, messageError: null, messageSuccess: null };
        case ModuleActionTypes.MODULE_DELETE:
            return { ...state, loading: false, messageError: null, messageSuccess: null };
        case ModuleActionTypes.MODULE_UPDATE_STATUS:
            return { ...state, loading: false, messageError: null, messageSuccess: null };
        case ModuleActionTypes.RESET:
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

export default Module;
