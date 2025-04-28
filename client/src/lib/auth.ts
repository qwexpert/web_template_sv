
import { api } from './api'


const API_BASE = import.meta.env.VITE_API_BASE

export async function login(username, password) {
    const res = await api(`${API_BASE}/api/login`, 'POST', { username, password })

    if (!res.token) throw res 

    localStorage.setItem('token', res.token)
    
    return res
}

export async function register(username, password) {
    const res = await api(`${API_BASE}/api/register`, 'POST', { username, password })
    return res
}

export function logout() {
    localStorage.removeItem('token')
}

export function isAuthenticated() {
    return !!localStorage.getItem('token')
}

export function parseJWT(token) {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
}