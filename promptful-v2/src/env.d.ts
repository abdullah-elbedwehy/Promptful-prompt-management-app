/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_TIMEOUT: string
    readonly VITE_ENABLE_DARK_MODE: string
    readonly VITE_ENABLE_NOTIFICATIONS: string
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    readonly VITE_CACHE_STALE_TIME: string
    readonly VITE_CACHE_RETRY_ATTEMPTS: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

// Environment configuration helper functions
export const getConfig = {
    apiUrl: () => import.meta.env.VITE_API_URL,
    apiTimeout: () => parseInt(import.meta.env.VITE_API_TIMEOUT),
    enableDarkMode: () => import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
    enableNotifications: () => import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    appName: () => import.meta.env.VITE_APP_NAME,
    appVersion: () => import.meta.env.VITE_APP_VERSION,
    cacheStaleTime: () => parseInt(import.meta.env.VITE_CACHE_STALE_TIME),
    cacheRetryAttempts: () => parseInt(import.meta.env.VITE_CACHE_RETRY_ATTEMPTS),
};