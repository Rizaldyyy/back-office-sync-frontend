export enum ClusterActionTypes {
    API_RESPONSE_SUCCESS = '@@cluster/API_RESPONSE_SUCCESS',
    API_RESPONSE_ERROR = '@@cluster/API_RESPONSE_ERROR',

    CLUSTER_LIST = '@@cluster/CLUSTER_LIST',
    CLUSTER_CREATE = '@@cluster/CLUSTER_CREATE',
    CLUSTER_UPDATE = '@@cluster/CLUSTER_UPDATE',
    CLUSTER_DELETE = '@@cluster/CLUSTER_DELETE',
    CLUSTER_UPDATE_STATUS = '@@cluster/CLUSTER_UPDATE_STATUS',

    RESET = '@@cluster/RESET',
}
