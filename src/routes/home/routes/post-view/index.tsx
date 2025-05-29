import { Flex, Stack } from "@chakra-ui/react"
import { memo } from "react"
import Post from "../../../../components/post"
import Comment from "../../../../components/comment"
import PostBox from "../../../../components/post-box"

const PostView = () => {
  return (
    <Stack direction={'column'} gap={8} w="100%" alignItems={'center'}>
      <Post />
      <PostBox buttonText="Comment" placeholder="Put your comment..." />
      <Stack gap={4}>
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
      </Stack>

    </Stack>
  )
}
export default memo(PostView) 