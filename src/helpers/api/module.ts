import { APICore } from './apiCore';

const api = new APICore();

// module
function moduleList(params: { name: string }) {
    const baseUrl = '/api/module/list/';
    return api.get(`${baseUrl}`, params);
}

function moduleCreate(params: { formData : {} }) {
    const baseUrl = '/api/module/store/';
    return api.create(`${baseUrl}`, params.formData);
}

function moduleUpdate(params: { formData : {} }) {
    const baseUrl = '/api/module/update/';
    return api.update(`${baseUrl}`, params.formData);
}

function moduleUpdateStatus(params: {adminId : number, id : number, status: number}) {
    const baseUrl = '/api/module/update/status';
    return api.update(`${baseUrl}`, params);
}

function moduleDelete(params: {adminId : number, id : number}) {
    const baseUrl = '/api/module/delete';
    return api.update(`${baseUrl}`, params);
}

export { moduleList, moduleCreate, moduleUpdate, moduleUpdateStatus, moduleDelete };
