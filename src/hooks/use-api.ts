import { useContext } from "react"
import { Flash7Api } from "../api/flash7Api"
import { ApiContext } from "../providers/api-provider"

export const useApi = (): { api: Flash7Api } => {
    const context = useContext(ApiContext)
    if (!context) {
        throw new Error('useApi must be used within an ApiProvider')
    }
    return context
}

