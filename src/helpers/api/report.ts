import { APICore } from './apiCore';

const api = new APICore();

// report
function reportGameTowlList(params: { formData : {} }) {
    const baseUrl = '/api/reports/turnover-winloss/';
    return api.create(`${baseUrl}`, params.formData);
}

// report
function reportPlayerTowlList(params: { formData : {} }) {
    const baseUrl = '/api/reports/turnover-winloss/';
    return api.create(`${baseUrl}`, params.formData);
}

export { reportGameTowlList, reportPlayerTowlList };
