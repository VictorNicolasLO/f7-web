import { useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export const useTopbar = (newsPath: string, personalFeedPath: string, username:string, userId:string) => {
    
    const navigate = useNavigate()
    const path = useLocation().pathname
    console.log('useTopbar path', path)
    const onChangeTab = useCallback((tab: string) => {
        console.log('onChangeTab', tab)
        if (tab === 'feed') {
            navigate(personalFeedPath)
        } else if (tab === 'news') {
            navigate(newsPath)
        }
    }, [])
    const tab = path === newsPath ? 'news' : path === personalFeedPath ? 'feed' : undefined
    console.log('useTopbar tab', tab)
    return {
        onChangeTab,
        tab,
        username,
        userId
    }
}