import { createContext, ReactNode, useEffect, useState } from 'react'
import type { Flash7Api } from '../api/flash7Api'
import { toaster } from "../components/ui/toaster"

type ApiProviderProps = {
    api: Flash7Api
    children: ReactNode
}

export const ApiContext = createContext<{ api: Flash7Api } | undefined>(undefined)

export const ApiProvider = ({ api, children }: ApiProviderProps) => {



    useEffect(() => {
        const handleError = (errors: any) => {
            console.error('API Error:', errors);
            for (const error of errors || []) {
                toaster.create({
                    title: 'API Error',
                    description: error.message || 'An error occurred while communicating with the API.',
                    type: 'error',
                    duration: 10000,
                })
            }

            // setErrorState((prev) => [...prev, errors]);
        }
        console.log('Setting up API error handler');
        api.onError = handleError;
        return () => {
            api.onError = undefined; // Clean up the error handler
        }
    }, [api]);
    return <>

        <ApiContext.Provider value={{ api }}>{children}</ApiContext.Provider>
    </>

}



