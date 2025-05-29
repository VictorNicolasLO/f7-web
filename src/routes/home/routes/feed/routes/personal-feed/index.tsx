import { Flex } from "@chakra-ui/react"
import Post from "../../../../../../components/post"
import { memo } from "react"

const PersonalFeed = () => {
  return (
          <>

            <Flex flexDirection={'column'} gap={8} alignItems={'center'} justifyContent={'center'}>
                {new Array(10).fill(0).map((_, i) => <Post />)}
            </Flex>
        </>
  )
}
export default memo(PersonalFeed)