import { Button, Flex, Spinner, Text } from "@chakra-ui/react"
import Post from "../../../../components/post"
import { LuStar, LuLogOut } from "react-icons/lu"
import { useParams } from 'react-router-dom'
import { useAuthenticatedAuth } from "../../../../hooks/use-auth"
import { useTimeline } from "../../../../hooks/use-timeline"
import { useCallback, useEffect, useState } from "react"
import { useApi } from "../../../../hooks/user-api"

const ProfileTimeline = () => {
    const params = useParams()
    const auth = useAuthenticatedAuth()
    const api = useApi()
    const [fetchedUsername, setFetchedUsername] = useState('')
    const userIdParam = params.id as string
    const isCurrentUser = userIdParam === auth.state.userIdB64


    const {
        posts,
        upToDate,
        loading,
        setRef,
        loaderRef,
        handleLike,
        loadingLikes
    } = useTimeline({ type: 'PROFILE', userKey: userIdParam })

    useEffect(() => {
        (async () => {
            if (!isCurrentUser) {
                const fetched = await api.userByKey(userIdParam)
                console.log('Fetched user:', fetched.data.data.username)
                setFetchedUsername(fetched.data.data.username)
            }   
        })();

    }, [isCurrentUser, userIdParam]);

    const follow = useCallback(async () => {
        if (isCurrentUser) return;
        await api.follow(userIdParam);
        console.log('Followed user:', userIdParam);
    }, [api, userIdParam])

    const username = isCurrentUser ? auth.state.username : fetchedUsername
    return (
        <Flex direction={'column'} gap={8} w="100%" alignItems={'center'}>
            <Flex width={'xl'} maxWidth={'xl'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                <Text fontSize={'5xl'} fontWeight={'bold'} textAlign={'center'}>{username}</Text>
            </Flex>
            {
                isCurrentUser ?
                    <Flex width={'xl'} maxWidth={'xl'} flexDirection={'column'} alignItems={'flex-end'} justifyContent={'flex-end'}>
                        <Button variant={'solid'} size={'sm'} onClick={auth.logout}>Logout <LuLogOut /></Button>
                    </Flex>
                    :
                    <Flex width={'xl'} maxWidth={'xl'} flexDirection={'column'} alignItems={'flex-end'} justifyContent={'flex-end'}>
                        <Button variant={'outline'} size={'sm'} onClick={follow}>Follow <LuStar /></Button>
                    </Flex>
            }

            <Flex flexDirection={'column'} gap={8} alignItems={'center'} justifyContent={'center'} width="100%">
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

        </Flex>
    )
}
export default ProfileTimeline