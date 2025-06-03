import { createContext, ReactNode, useCallback, useState } from 'react'
import { useApi } from '../hooks/user-api';


export type AuthState = {
    isAuthenticated: false;
} | {
    isAuthenticated: true;
    username: string;
    userId: string;
    refreshToken: string;
    accessToken: string;
}


const useAuthProvider = () => {
    const [authState, setAuthState] = useState<AuthState>();
    const api = useApi();
    const login = useCallback(async (username: string, password: string) => {
        const response = await api.auth(username, password);
        if (response.error) {
            throw new Error(response.error);
        }
        const { accessToken, refreshToken } = response;
        setAuthState({
            isAuthenticated: true,
            username: refreshToken.publicUsername,
            userId: refreshToken.userId,
            accessToken,
            refreshToken: refreshToken.refreshToken
        });
    }, [setAuthState])

    return {
        login,
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
