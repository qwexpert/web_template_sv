import { writable } from 'svelte/store'
import { login, register, isAuthenticated, logout } from '$lib/auth'
import { parseJWT } from "$lib/auth"


interface AuthStore {
    userId: string
    username: string
    password: string
    error: string
    isRegistering: boolean
    authenticated: boolean
}


function createAuthStore() {
    const { subscribe, update, set } = writable<AuthStore>({
        userId: '',
        username: '',
        password: '',
        error: '',
        isRegistering: false,
        authenticated: false
    })

    const getCurrentStore = () => {
        let current: AuthStore

        subscribe(s => current = s)()

        return current;
    }

    return {
        subscribe,

        checkAuth: () => {
            const authStatus = isAuthenticated()
            const token = localStorage.getItem('token')
            const claims = token ? parseJWT(token) : null

            update(store => ({
                ...store,
                authenticated: authStatus,
                username: claims?.username || '',
                userId: claims?.user_id || ''
            }))

            return authStatus
        },

        handleAuth: async () => {
            update(store => ({ ...store, error: '' }))

            try {
                const { username, password, isRegistering } = getCurrentStore()

                if (isRegistering) await register(username, password)

                await login(username, password)

                update(store => ({ ...store, authenticated: true, error: '' }))

                return true
            } catch (err) {
                update(store => ({
                    ...store,
                    authenticated: false,
                    error: err.message || 'Authentication failed'
                }))

                logout()

                return false
            }
        },

        logout: () => {
            logout() 

            set({
                userId: '',
                username: '',
                password: '',
                error: '',
                isRegistering: false,
                authenticated: false
            })
        },

        toggleAuthMode: () => {
            update(store => ({
                ...store,
                isRegistering: !store.isRegistering,
                error: ''
            }))
        },

        updateField: (field: keyof AuthStore, value: string | boolean) => {
            update(store => ({ ...store, [field]: value }))
        },
    }
}


export const authStore = createAuthStore()

// if (typeof window !== 'undefined') authStore.checkAuth()
