/**
 * Arreglo de rutas qie son accesibles para el publico
 * Estas rutas no requieren autenticacion
 * @type {string[]}
*/
export const publicRoutes = [
    "/",
    "/auth/new-verification",
];

/**
 * Arreglo de rutas qie son accesibles para el publico
 * Estas rutas redireccionaran logged a usuarios para settings
 * @type {string[]}
*/
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
];

export const adminRoutes = [
    "/settings/users",
    "/settings/password",
];

/**
 * El prefijo para autenticacion de rutas API
 * Rutas que empezaran con este prefijo usados para API
 * @type {string}
*/
export const apiAuthPrefix = "/api/auth"

/**
 * Por defecto redirecciona despues de logearse
 * @type {string}
*/
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"
    
