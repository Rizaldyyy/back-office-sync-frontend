import { APICore } from './apiCore';

const api = new APICore();

// cluster
function clusterList(params: { name: string }) {
    const baseUrl = '/api/cluster/list/';
    return api.get(`${baseUrl}`, params);
}

function clusterCreate(params: { formData : {} }) {
    const baseUrl = '/api/cluster/store/';
    return api.create(`${baseUrl}`, params.formData);
}

function clusterUpdate(params: { formData : {} }) {
    const baseUrl = '/api/cluster/update/';
    return api.update(`${baseUrl}`, params.formData);
}

function clusterUpdateStatus(params: {adminId : number ,id : number, status: number}) {
    const baseUrl = '/api/cluster/update/status';
    return api.update(`${baseUrl}`, params);
}

function clusterDelete(params: {adminId : number ,id : number}) {
    const baseUrl = '/api/cluster/delete';
    return api.update(`${baseUrl}`, params);
}

export { clusterList, clusterCreate, clusterUpdate, clusterUpdateStatus, clusterDelete };
