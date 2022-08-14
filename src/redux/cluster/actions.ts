// constants
import { ClusterActionTypes } from './constants';

export interface ClusterActionType {
    type:
    | ClusterActionTypes.API_RESPONSE_SUCCESS
    | ClusterActionTypes.API_RESPONSE_ERROR
    | ClusterActionTypes.CLUSTER_LIST
    | ClusterActionTypes.CLUSTER_CREATE
    | ClusterActionTypes.CLUSTER_UPDATE
    | ClusterActionTypes.CLUSTER_DELETE
    | ClusterActionTypes.CLUSTER_UPDATE_STATUS
    | ClusterActionTypes.RESET;
    payload: {} | string;
}

interface ClusterData {
    id? : number;
    adminId? : number;
    name: string;
    api_url: string;
    cluster_url: string;
}

// common success
export const clusterApiResponseSuccess = (actionType: string, data: ClusterData | {}): ClusterActionType => ({
    type: ClusterActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const clusterApiResponseError = (actionType: string, error: string): ClusterActionType => ({
    type: ClusterActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const clusterList = (name : string): ClusterActionType => ({
    type: ClusterActionTypes.CLUSTER_LIST,
    payload: { name },
});

export const clusterCreate = (formData : ClusterData): ClusterActionType => ({
    type: ClusterActionTypes.CLUSTER_CREATE,
    payload: { formData },
});

export const clusterUpdate = (formData : ClusterData): ClusterActionType => ({
    type: ClusterActionTypes.CLUSTER_UPDATE,
    payload: { formData },
});

export const clusterDelete = (adminId : number, id : number): ClusterActionType => ({
    type: ClusterActionTypes.CLUSTER_DELETE,
    payload: { adminId, id },
});

export const clusterUpdateStatus = (adminId : number, id : number, status : number): ClusterActionType => ({
    type: ClusterActionTypes.CLUSTER_UPDATE_STATUS,
    payload: { adminId, id, status },
});

export const resetCluster = (): ClusterActionType => ({
    type: ClusterActionTypes.RESET,
    payload: {},
});
