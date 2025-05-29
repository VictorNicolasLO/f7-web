
import { Stack } from "@chakra-ui/react"
import TopBar from "../../components/topbar"
import { useTopbar } from "../../components/topbar/hooks/user-topbar"
import HomeRouter from "./router"
import { memo } from "react"

const NEWS_PATH = '/home/feed/news'
const PERSONAL_FEED_PATH = '/home/feed/personal-feed'

const Home = () => {
  const topbarProps = useTopbar(NEWS_PATH, PERSONAL_FEED_PATH)

  return (<Stack gap={12}>
    <TopBar {...topbarProps} />
    <HomeRouter />
  </Stack>

  )
}
export default memo(Home)