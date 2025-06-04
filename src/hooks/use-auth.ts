import {  useContext } from "react";
import { AuthContext, AuthenticatedState } from "../providers/auth-provider";




export const useAuth = ()=> {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return authContext;
}

export const useAuthenticatedAuth = () => {
    const auth = useAuth();
    if (auth.state.status !== 'authenticated') {
        throw new Error('User is not authenticated');
    }

    return {...auth, state: auth.state as AuthenticatedState};
}