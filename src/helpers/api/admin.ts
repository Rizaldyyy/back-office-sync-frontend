import { APICore } from './apiCore';

const api = new APICore();

// admin
function adminList(params: { username: string, group_id: number, location_id: number }) {
    const baseUrl = '/api/admin/list/';
    return api.get(`${baseUrl}`, params);
}

function adminCreate(params: { formData : {} }) {
    const baseUrl = '/api/admin/store/';
    return api.create(`${baseUrl}`, params.formData);
}

function adminUpdate(params: { formData : {} }) {
    const baseUrl = '/api/admin/update/';
    return api.update(`${baseUrl}`, params.formData);
}

function adminUpdateStatus(params: {adminId : number ,id : number, status: number}) {
    const baseUrl = '/api/admin/update/status';
    return api.update(`${baseUrl}`, params);
}

function adminDelete(params: {adminId : number ,id : number}) {
    const baseUrl = '/api/admin/delete';
    return api.update(`${baseUrl}`, params);
}

function adminLogs(params: { cluster: string, admin: string, action: string, detail: string }) {
    const baseUrl = '/api/admin/logs/';
    return api.get(`${baseUrl}`, params);
}

function adminLocation(params: {}) {
    const baseUrl = '/api/admin/location/';
    return api.get(`${baseUrl}`, params);
}

function adminChangePassword(params: { formData : {} }) {
    const baseUrl = '/api/admin/change-password';
    return api.update(`${baseUrl}`, params.formData);
}

export { adminList, adminCreate, adminUpdate, adminUpdateStatus, adminDelete, adminLocation, adminLogs, adminChangePassword };
