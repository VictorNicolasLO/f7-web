import { Flex, For } from "@chakra-ui/react"
import PostBox from "../../../../../../components/post-box"
import Post from "../../../../../../components/post"
import { memo } from "react"

const News = () => {
    return (
        <>
                <Flex flexDirection={'column'} gap={8} alignItems={'center'} justifyContent={'center'}>
                    {new Array(10).fill(0).map((_, i) => <Post />)}
                </Flex>
       
        </>
    )
}
export default memo(News)