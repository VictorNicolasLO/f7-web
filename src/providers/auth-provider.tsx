import { createContext, ReactNode, useCallback, useEffect, useState } from 'react'
import { useApi } from '../hooks/user-api';
import { getExpFromJWT } from '../utils/jwt-utils';

export type AuthenticatedState = {
    status: 'authenticated';
    username: string;
    userId: string;
    refreshToken: string;
    accessToken: string;
    userIdB64: string;
}

export type AuthState = {
    status: 'not-ready';
} | {
    status: 'authenticating';
} | {
    status: 'unauthenticated';
} | AuthenticatedState



let timeout: ReturnType<typeof setTimeout> | null = null;
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;


const makeGetOrRefreshAccessToken = (authState: AuthState, api: ReturnType<typeof useApi> ,setAuthState: any) => async () => {
        
        if (authState.status !== 'authenticated') {
            throw new Error('Not authenticated');
        }
        const exp = getExpFromJWT(authState.accessToken);
        const now = Math.floor(Date.now() / 1000);
        if (exp && exp > now + 5) {
            return authState.accessToken;
        }
        console.log('Access token expired, refreshing...');
        const { accessToken } = await api.callRefreshToken(authState.refreshToken);
        api.setAuthTokens(accessToken);
        const nextAuthState: AuthenticatedState = {
            ...authState,
            accessToken,
        }
        localStorage.setItem('flash7-auth', JSON.stringify(nextAuthState));
        setAuthState(nextAuthState);
        return accessToken;
    }


const useAuthProvider = () => {
    const [authState, setAuthState] = useState<AuthState>({ status: 'not-ready' });
    const api = useApi();

    const logout = useCallback(() => {
        localStorage.removeItem('flash7-auth');
        window.location.reload();
    }, [setAuthState]);

 

    // Helper to set refresh timeout for access token
    // const setRefreshTimeout = useCallback((authStateForRefresh: AuthState) => {
    //     if(authStateForRefresh.status !== 'authenticated') {
    //         return;
    //     }
    //     if (timeout) clearTimeout(timeout);
    //     const exp = getExpFromJWT(authStateForRefresh.accessToken);
    //     console.log('Setting refresh timeout for access token', exp);
    //     if (!exp) return;
    //     const now = Math.floor(Date.now() / 1000);
    //     const ms = Math.max((exp - now - 5) * 1000, 0);
    //     console.log(ms, 'ms until access token expiry');
    //     timeout = setTimeout(async () => {
    //         console.log('Refreshing access token');
    //         const {accessToken} = await api.callRefreshToken(authStateForRefresh.refreshToken);
    //         api.setAuthTokens(accessToken, authStateForRefresh.refreshToken);
    //         const nextAuthState: AuthenticatedState = {
    //             ...authStateForRefresh,
    //             accessToken,
    //         }
    //         localStorage.setItem('flash7-auth', JSON.stringify(nextAuthState));
    //         setAuthState(nextAuthState);
    //         setRefreshTimeout(accessToken);
    //     }, ms);
    // }, [authState, api]);


  

    // Helper to set timeout for refresh token expiry (logout)
    const setRefreshTokenExpiryTimeout = useCallback((refreshToken: string) => {
        if (refreshTimeout) clearTimeout(refreshTimeout);
        const exp = getExpFromJWT(refreshToken);
        if (!exp) return;
        const now = Math.floor(Date.now() / 1000);
        const ms = Math.max((exp - now - 5) * 1000, 0);
        console.log(ms, 'ms until refresh token expiry');
        refreshTimeout = setTimeout(() => {
            logout();
        }, ms);
    }, [logout]);

    const login = useCallback(async (username: string, password: string) => {
        if (authState.status === 'authenticated') {
            throw new Error('Already authenticated');
        }
        setAuthState({ status: 'authenticating' });
        const response = await api.auth(username, password);
        if (response.error) {
            throw new Error(response.error);
        }
        const { accessToken, refreshToken } = response;
        const nextAuthState: AuthState = {
            status: "authenticated",
            username: refreshToken.publicUsername,
            userId: refreshToken.userId,
            userIdB64: refreshToken.userIdB64,
            accessToken,
            refreshToken: refreshToken.refreshToken,
        }
        api.setAuthTokens(makeGetOrRefreshAccessToken(nextAuthState, api, setAuthState));
        localStorage.setItem('flash7-auth', JSON.stringify(nextAuthState));
        setAuthState(nextAuthState);
        // setRefreshTimeout(nextAuthState);
        setRefreshTokenExpiryTimeout(refreshToken.refreshToken);
    }, [setAuthState, setRefreshTokenExpiryTimeout])

    useEffect(()=>{
        const storedAuth = localStorage.getItem('flash7-auth');
        if (storedAuth) {
            const parsedAuth = JSON.parse(storedAuth) as AuthState;
            if (parsedAuth.status === 'authenticated') {
                api.setAuthTokens(makeGetOrRefreshAccessToken(parsedAuth, api, setAuthState));
                setAuthState(parsedAuth);
                // setRefreshTimeout(parsedAuth);
                setRefreshTokenExpiryTimeout(parsedAuth.refreshToken);
            } else {
                setAuthState({ status: 'unauthenticated' });
            }
        } else {
            setAuthState({ status: 'unauthenticated' });
        }
        return () => {
            if (timeout) clearTimeout(timeout);
            if (refreshTimeout) clearTimeout(refreshTimeout);
        };
    }, [])

    useEffect(() => {
        if (authState.status !== 'authenticated') return;
        api.setAuthTokens(makeGetOrRefreshAccessToken(authState, api, setAuthState));
    }, [authState])


    return {
        login,
        logout,
        state: authState,
    }

}


type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<ReturnType<typeof useAuthProvider> | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const providerState = useAuthProvider();
    return <AuthContext.Provider value={providerState}>{children}</AuthContext.Provider>;
}
