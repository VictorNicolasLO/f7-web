import { useCallback, useContext, useState } from "react";
import { AuthContext } from "../providers/auth-provider";
import { useApi } from "./user-api";



export const useAuth = ()=> {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return authContext;
}