import { isExpired, decodeToken } from "react-jwt";

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

export const login = data => {
    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
}

export const logout = (e) => {
    // alert("Hello")
    if( window.confirm( 'Are you sure to log out?') )    {
        flushUserSession();
        window.location = '/';
    }
    e.preventDefault();
}

export const flushUserSession = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
}

export const isAuthenticated = () => {
    if (localStorage.getItem(AUTH_TOKEN_KEY)) {
        return true;
    }
    return false;
}

export const getToken = () => {
   return localStorage.getItem(AUTH_TOKEN_KEY);
}

export const getBearer = () => {
    // console.log(getAuthUser())
    const AuthToken = getToken();
    return AuthToken ? 'Bearer ' + AuthToken : null
 }

export const getAuthUser = () => {
    // flushUserSession();
    if( !isAuthenticated() ) return null;
    // console.log(localStorage.getItem(AUTH_USER_KEY))
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY));
}

export const getAuthUserFullname = () => {
    const user = getAuthUser();
    if( user ) return `${user.first_name} ${user.last_name}`
}

export const asyncLocalStorage = {
    setItem: async function (key, value) {
        await null;
        return localStorage.setItem(key, value);
    },
    getItem: async function (key) {
        await null;
        return localStorage.getItem(key);
    }
};