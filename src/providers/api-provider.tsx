import  { createContext, ReactNode } from 'react'
import type { Flash7Api } from '../api/flash7Api'

type ApiProviderProps = {
    api: Flash7Api
    children: ReactNode
}

export const ApiContext = createContext<Flash7Api | undefined>(undefined)

export const ApiProvider = ({ api, children }: ApiProviderProps) => (
    <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
)

