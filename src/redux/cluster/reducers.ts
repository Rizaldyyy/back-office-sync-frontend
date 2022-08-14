// constants
import { ClusterActionTypes } from './constants';

const INIT_STATE = {
    loading: true,
    dataError: null,
    messageSuccess: null,
    messageError: null,
};

interface ClusterActionType {
    type:
        | ClusterActionTypes.API_RESPONSE_SUCCESS
        | ClusterActionTypes.API_RESPONSE_ERROR
        | ClusterActionTypes.CLUSTER_LIST
        | ClusterActionTypes.CLUSTER_CREATE
        | ClusterActionTypes.CLUSTER_UPDATE
        | ClusterActionTypes.CLUSTER_DELETE
        | ClusterActionTypes.CLUSTER_UPDATE_STATUS
        | ClusterActionTypes.RESET;
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

const Cluster = (state: State = INIT_STATE, action: ClusterActionType): any => {
    switch (action.type) {
        case ClusterActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case ClusterActionTypes.CLUSTER_LIST: {
                    return {
                        ...state,
                        data: action.payload.data,
                        loading: false,
                    };
                }
                case ClusterActionTypes.CLUSTER_CREATE: {
                    const param : any = action.payload.data;
                    const data = state.data?.concat(param.data);
                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case ClusterActionTypes.CLUSTER_UPDATE: {
                    const param : any = action.payload.data;
                    const data = state.data.map((cluster : any) => {
                        return cluster.id === param.data.id ? param.data : cluster
                    });

                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case ClusterActionTypes.CLUSTER_DELETE: {
                    const param : any = action.payload.data;
                    const data = state.data.filter((cluster : any) => cluster.id !== param.id)
                    return {
                        ...state,
                        data: data,
                        messageSuccess: param.message,
                        loading: false,
                    };
                }
                case ClusterActionTypes.CLUSTER_UPDATE_STATUS: {
                    const param : any = action.payload.data;
                    const data = state.data.map((cluster : any) => {
                        return cluster.id === param.id ? { ...cluster, status: param.status } : cluster
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

        case ClusterActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case ClusterActionTypes.CLUSTER_LIST: {
                    return {
                        ...state,
                        dataError: action.payload.error,
                        loading: false,
                    };
                }
                case ClusterActionTypes.CLUSTER_CREATE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case ClusterActionTypes.CLUSTER_UPDATE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case ClusterActionTypes.CLUSTER_DELETE: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                case ClusterActionTypes.CLUSTER_UPDATE_STATUS: {
                    return {
                        ...state,
                        messageError: action.payload.error,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }
        case ClusterActionTypes.CLUSTER_LIST:
            return { ...state, loading: true, dataError: null };
        case ClusterActionTypes.CLUSTER_CREATE:
            return { ...state, loading: true, messageError: null, messageSuccess: null };
        case ClusterActionTypes.CLUSTER_UPDATE:
            return { ...state, loading: true, messageError: null, messageSuccess: null };
        case ClusterActionTypes.CLUSTER_DELETE:
            return { ...state, loading: false, messageError: null, messageSuccess: null };
        case ClusterActionTypes.CLUSTER_UPDATE_STATUS:
            return { ...state, loading: false, messageError: null, messageSuccess: null };
        case ClusterActionTypes.RESET:
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

export default Cluster;
