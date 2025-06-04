import { Flex, For, Spinner } from "@chakra-ui/react"
import Post from "../../../../../../components/post"
import { memo, useEffect, useState } from "react"
import { useApi } from "../../../../../../hooks/user-api"

const News = () => {
    const api = useApi()
    const [posts, setPosts] = useState<any[]>([])
    useEffect(() => {
        (async () => {
            const news = await api.globalFeed(undefined, 5)
            console.log(news)
            setPosts(news.data)
        })()
    }, [setPosts])
    console.log(posts)
    return (
        <>
            <Flex flexDirection={'column'} gap={8} alignItems={'center'} justifyContent={'center'}>
                {posts.map((post) => <Post key={post.key} 
                content={post.data.content} 
                comments={post.data.comments} 
                views={post.data.views} 
                likes={post.data.likes} 
                postId={post.key} 
                userId={post.data.userKey} 
                username={post.data.username} />)}
                {/* <Spinner size={'xl'} color={'blue.500'} /> */}
            </Flex>

        </>
    )
}
export default memo(News)