import { APICore } from './apiCore';

const api = new APICore();

// account
function login(params: { username: string; password: string }) {
    const baseUrl = '/api/auth/login/';
    return api.create(`${baseUrl}`, params);
}

function logout() {
    const baseUrl = '/api/auth/logout/';
    return api.create(`${baseUrl}`, {});
}

function signup(params: { fullname: string; email: string; password: string }) {
    const baseUrl = '/register/';
    return api.create(`${baseUrl}`, params);
}

function forgotPassword(params: { email: string }) {
    const baseUrl = '/forget-password/';
    return api.create(`${baseUrl}`, params);
}

export { login, logout, signup, forgotPassword };
