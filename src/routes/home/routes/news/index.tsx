import { Flex, Spinner, Stack } from "@chakra-ui/react"
import Post from "../../../../components/post"
import { memo, useCallback, useState } from "react"

import { useTimeline } from "../../../../hooks/use-timeline"
import PostBox from "../../../../components/post-box"
import { useInput } from "../../../../hooks/use-input"
import { useApi } from "../../../../hooks/user-api"
import { ulid } from "ulid"

const News = () => {
    const {
        posts,
        upToDate,
        loading,
        setRef,
        loaderRef,
        handleLike,
        loadingLikes
    } = useTimeline({ type: 'GLOBAL' })

    const input = useInput('')
    const api = useApi()
    const [loadingSendPost, setLoading] = useState(false)
    const sendPost = useCallback(async (value?: string) => {
        if (!value || value.trim() === '') {
            return
        }
        setLoading(true)
        await api.post(ulid(), value)
        input.reset()
        setLoading(false)

    }, [])

    return (
        <Stack gap={8}>
            <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                <PostBox {...input} onSubmit={sendPost} loading={loadingSendPost} />
            </Flex>
            <Flex flexDirection={'column'} gap={8} alignItems={'center'} justifyContent={'center'}>
                {posts.map((post) => <Post
                    key={post.key}
                    content={post.data.content}
                    comments={post.data.comments}
                    views={post.data.views}
                    likes={post.data.likes}
                    postId={post.key}
                    userId={post.data.userKey}
                    username={post.data.username}
                    onLike={handleLike}
                    hasLike={post.data.hasLike}
                    loadingLike={loadingLikes[post.key] || false}
                    setRef={setRef}
                />)}
                {!upToDate && <div >
                    {loading ? <Spinner size={'xl'} color={'blue.500'} /> : <div ref={loaderRef} style={{ width: '60px', height: '60px' }} />}
                </div>}
            </Flex>

        </Stack>
    )
}
export default memo(News)