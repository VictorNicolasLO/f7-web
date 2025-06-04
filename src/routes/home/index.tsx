
import { Stack } from "@chakra-ui/react"
import TopBar from "../../components/topbar"
import { useTopbar } from "../../components/topbar/hooks/user-topbar"
import HomeRouter from "./router"
import { memo, useEffect } from "react"
import {useAuthenticatedAuth } from "../../hooks/use-auth"
import { useApi } from "../../hooks/user-api"

const NEWS_PATH = '/feed/news'
const PERSONAL_FEED_PATH = '/feed/personal-feed'

const Home = () => {
  const auth = useAuthenticatedAuth()
  const api = useApi()
  const topbarProps = useTopbar(
    NEWS_PATH, 
    PERSONAL_FEED_PATH, 
    auth.state.username, 
    auth.state.userIdB64
  )
  useEffect(()=>{
    (async ()=> {
     await api.activateUser()
    })();
    
  }, [])
  return (<Stack gap={12}>
    <TopBar {...topbarProps} />
    <HomeRouter />
  </Stack>

  )
}
export default memo(Home)