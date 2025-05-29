import { memo } from "react"
import FeedRouter from "./router"
import PostBox from "../../../../components/post-box"
import { Flex, Stack } from "@chakra-ui/react"

const Feed = () => {
  return (
    <Stack gap={8}>
      <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
        <PostBox />
      </Flex>

      <FeedRouter />
    </Stack>

  )
}
export default memo(Feed)