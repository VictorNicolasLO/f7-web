import { Button, Flex, Link, Spinner, Text } from "@chakra-ui/react"
import Post from "../../../../components/post"
import { LuStar, LuLogOut, LuMessageSquareMore } from "react-icons/lu"
import { useParams } from 'react-router-dom'
import { useAuthenticatedAuth } from "../../../../hooks/use-auth"
import { useTimeline } from "../../../../hooks/use-timeline"
import { useCallback, useEffect, useState } from "react"
import { useApi } from "../../../../hooks/use-api"

const ProfileTimeline = () => {
    const params = useParams()
    const auth = useAuthenticatedAuth()
    const { api } = useApi()
    const [fetchedUser, setFetchedUser] = useState<{ username?: string, isFollowing?: boolean, notFound?: boolean } | undefined>()
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
                if (!fetched.data) {
                    console.error('User not found:', userIdParam);
                    setFetchedUser({ notFound: true });
                    return;
                }
                console.log('Fetched user:', fetched.data.data)
                setFetchedUser(fetched.data.data)
            }
        })();

    }, [isCurrentUser, userIdParam]);

    const follow = useCallback(async () => {
        if (isCurrentUser) return;
        await api.follow(userIdParam);
        setFetchedUser((prev) => ({
            ...prev,
            isFollowing: true,
        }))
        console.log('Followed user:', userIdParam);
    }, [api, userIdParam])

    const unfollow = useCallback(async () => {
        if (isCurrentUser) return;
        await api.unfollow(userIdParam);
        setFetchedUser((prev) => ({
            ...prev,
            isFollowing: false
        }))
        console.log('Followed user:', userIdParam);
    }, [api, userIdParam])


    const username = isCurrentUser ? auth.state.username : fetchedUser?.username || ''


    if (fetchedUser?.notFound) {
        return (
            <Flex direction={'column'} gap={8} w="100%" alignItems={'center'}>
                <Text fontSize={'2xl'} fontWeight={'bold'} textAlign={'center'}>User not found</Text>
            </Flex>
        )
    }

    console.log('Fetched user:', fetchedUser?.isFollowing, username)
    return (
        <Flex direction={'column'} gap={8} w="100%" alignItems={'center'}>
            <Flex width={'100%'} maxW={'100%'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>

                <Text fontSize={{ smDown: '4xl', base: '5xl', }} fontWeight={'bold'} textAlign={'center'} truncate maxW={'100%'} >{username}</Text>
            </Flex>
            <Flex width={'xl'} maxW={'100%'} flexDirection={'column'} alignItems={'flex-end'} justifyContent={'flex-end'} paddingRight={{ smDown: 2 }}>
                {
                    isCurrentUser ?
                        <Flex gap={4} alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>

                            <Link href="https://forms.gle/GCVsskZt8V5wSWsaA" target="_blank">
                                Help use to improve <LuMessageSquareMore />
                            </Link>
                            <Button variant={'solid'} size={'sm'} onClick={auth.logout}>Logout <LuLogOut /></Button>
                        </Flex>
                        :
                        fetchedUser && fetchedUser.isFollowing ?
                            <Button variant={'outline'} size={'sm'} onClick={unfollow} color={'flash7'}>Unfollow <LuStar /></Button>
                            :
                            <Button variant={'outline'} size={'sm'} onClick={follow} color={'initial'}>Follow <LuStar /></Button>
                }
            </Flex>

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