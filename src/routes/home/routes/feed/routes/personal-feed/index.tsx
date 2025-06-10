import { Flex, Spinner } from "@chakra-ui/react"
import Post from "../../../../../../components/post"
import { memo } from "react"
import { useTimeline } from "../../../../../../hooks/use-timeline"

const PersonalFeed = () => {
      const {
        posts,
        upToDate,
        loading,
        setRef,
        loaderRef,
        handleLike,
        loadingLikes
    } = useTimeline({ type : 'PERSONAL_FEED'})
    return (
        <>
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
                {
                  upToDate && posts.length === 0 && <Flex width={'xl'} maxWidth={'xl'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                    <p>No posts found in your personal feed.</p>
                  </Flex>
                }



            </Flex>

        </>
    )
}
export default memo(PersonalFeed)