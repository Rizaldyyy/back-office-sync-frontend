import { APICore } from './apiCore';

const api = new APICore();

// role
function roleList(params: { name: string }) {
    const baseUrl = '/api/role/list/';
    return api.get(`${baseUrl}`, params);
}

function roleCreate(params: { formData : {} }) {
    const baseUrl = '/api/role/store/';
    return api.create(`${baseUrl}`, params.formData);
}

function roleUpdate(params: { formData : {} }) {
    const baseUrl = '/api/role/update/';
    return api.update(`${baseUrl}`, params.formData);
}

function roleUpdateStatus(params: {adminId : number ,id : number, status: number}) {
    const baseUrl = '/api/role/update/status';
    return api.update(`${baseUrl}`, params);
}

function roleDelete(params: {adminId : number ,id : number}) {
    const baseUrl = '/api/role/delete';
    return api.update(`${baseUrl}`, params);
}

export { roleList, roleCreate, roleUpdate, roleUpdateStatus, roleDelete };
