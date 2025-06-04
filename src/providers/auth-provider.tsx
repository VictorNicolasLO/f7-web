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
const useAuthProvider = () => {
    const [authState, setAuthState] = useState<AuthState>({ status: 'not-ready' });
    const api = useApi();

    // Helper to set refresh timeout
    const setRefreshTimeout = useCallback((accessToken: string) => {
        if(authState.status !== 'authenticated') {
            return;
        }
        if (timeout) clearTimeout(timeout);
        const exp = getExpFromJWT(accessToken);
        if (!exp) return;
        const now = Math.floor(Date.now() / 1000);
        const ms = Math.max((exp - now - 5) * 1000, 0);
        timeout = setTimeout(async () => {
            const accessToken = await api.callRefreshToken(authState.refreshToken);
            api.setAuthTokens(accessToken, authState.refreshToken);
            const nextAuthState: AuthenticatedState = {
                ...authState,
                accessToken,
            }
            localStorage.setItem('flash7-auth', JSON.stringify(nextAuthState));
            setAuthState(nextAuthState);
        }, ms);
    }, []);

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
        api.setAuthTokens(accessToken, refreshToken.refreshToken);
        localStorage.setItem('flash7-auth', JSON.stringify(nextAuthState));
        setAuthState(nextAuthState);
        setRefreshTimeout(accessToken);
    }, [setAuthState, setRefreshTimeout])


    useEffect(()=>{
        const storedAuth = localStorage.getItem('flash7-auth');
        if (storedAuth) {
            const parsedAuth = JSON.parse(storedAuth) as AuthState;
            if (parsedAuth.status === 'authenticated') {
                api.setAuthTokens(parsedAuth.accessToken, parsedAuth.refreshToken);
                setAuthState(parsedAuth);
                setRefreshTimeout(parsedAuth.accessToken);
            } else {
                setAuthState({ status: 'unauthenticated' });
            }
        } else {
            setAuthState({ status: 'unauthenticated' });
        }
        return () => { if (timeout) clearTimeout(timeout); };
    }, [])


    const logout = useCallback(() => {
        localStorage.removeItem('flash7-auth');
        window.location.reload()
    }, [setAuthState]);

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
