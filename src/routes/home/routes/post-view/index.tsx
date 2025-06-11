import { Button, Flex, Stack } from "@chakra-ui/react"
import { memo, useCallback, useEffect, useState } from "react"
import Post from "../../../../components/post"
import Comment from "../../../../components/comment"
import PostBox from "../../../../components/post-box"
import { useApi } from "../../../../hooks/user-api"
import { useParams } from "react-router-dom"
import { useInput } from "../../../../hooks/use-input"
import { LuChevronsDown } from 'react-icons/lu'
import { set } from "date-fns"


const CommentsSection = memo(({ comments }: { comments?: any[] }) => {
  return <Stack gap={4} width="100%" alignItems={'center'} >
    {comments?.map((comment) => (
      <Comment
        key={comment.sortKey}
        content={comment.data.content}
        userId={comment.data.userKey}
        username={comment.data.username} 
        commentKey={comment.sortKey}
        />
    ))}

  </Stack>
})

type PostViewState = {
  post?: any;
  loading: boolean;
  loadingSend?: boolean;
  comments?: any[];
  commentsUpdated?: boolean;
  commentsLoading?: boolean;
}
const FETCH_COMMENTS_LIMIT = 10 // Cant be less than 2
const PostView = () => {
  const api = useApi()
  const params = useParams()
  const [{ loading, post, loadingSend, comments, commentsUpdated, commentsLoading }, setPostView] = useState<PostViewState>({ loading: true })
  const inputBox = useInput('')
  const postKey = params.id
  const like = useCallback(async (postId: string) => {
    await api.like(postId)
    console.log('Post liked:', post)
    setPostView((prevPostView) => {
      const hasLike = prevPostView.post?.data?.hasLike || false
      return ({
        ...prevPostView,
        post: {
          ...prevPostView.post,
          data: {
            ...prevPostView.post.data,
            hasLike: !hasLike,
            likes: hasLike ? prevPostView.post.data.likes + -1 : prevPostView.post.data.likes + 1
          }
        }
      })
    })
  }, [api])

  useEffect(() => {
    (async () => {

      if (!postKey) {
        setPostView({ loading: false })
        return
      }
      const postPromise = api.postByKey(postKey)
      const commentsPromise = api.comments(postKey, undefined, FETCH_COMMENTS_LIMIT)

      const [post, comments] = await Promise.all([postPromise, commentsPromise])
      console.log('Comments fetched:', comments)
      console.log('Post fetched:', post)
      if (!post) {
        setPostView({ loading: false })
        return
      }
      setPostView((prevPostView) => ({ ...prevPostView, post: post.data, comments: comments.data, loading: false, commentsUpdated: comments.data.length < FETCH_COMMENTS_LIMIT }))

    })()

  }, [api])

  const comment = useCallback(async (value?: string) => {
    if (!value || value.trim() === '') {
      return
    }
    setPostView((prevPostView) => ({ ...prevPostView, loadingSend: true }))
    await api.comment(post.key, value)
    inputBox.reset()
    setPostView((prevPostView) => ({ ...prevPostView, loadingSend: false }))
  }, [api, post, inputBox])


  const loadMoreComments = useCallback(async () => {
    if (loading || commentsLoading || !postKey) return;
    setPostView((prevPostView) => ({ ...prevPostView, commentsLoading: true }))
    const lastComment = comments?.[comments.length - 1];
    console.log('Last comment:', lastComment)
    const newComments = await api.comments(postKey, lastComment.sortKey, FETCH_COMMENTS_LIMIT)
    console.log('Loaded comments from infinite loading', newComments)
    if (lastComment) {
      if (newComments.data.length === 1) {
        setPostView((prevPostView) => ({ ...prevPostView, commentsUpdated: true, commentsLoading: false }));
        return;
      }
      setPostView((prevPostView) => ({
        ...prevPostView,
        comments: [...prevPostView.comments || [], ...newComments.data.filter((comment: any) => comment.sortKey !== lastComment?.sortKey)],
        commentsLoading: false
      }));
      if (newComments.data.length < FETCH_COMMENTS_LIMIT) {
        setPostView((prevPostView) => ({ ...prevPostView, commentsUpdated: true, commentsLoading: false }));
      }
    } else {
      setPostView((prevPostView) => ({
        ...prevPostView,
        comments: [...prevPostView.comments || [], ...newComments.data],
        commentsLoading: false
      }));
    }
  }, [comments, loading, api])

  useEffect(() => {
    const updateCommentsTimeline = async () => {

      const firstComment = comments ? comments[0]:undefined;
      const news = await api.comments(postKey || '',firstComment?.sortKey, FETCH_COMMENTS_LIMIT, false)
      console.log('Updating timeline comments', news)
      if (firstComment) {
        setPostView((prevPostView) => ({
          ...prevPostView,
          comments: [...news.data.filter((comment: any) => comment.sortKey !== firstComment.sortKey), ...(prevPostView.comments || [])],
        }));
      } else {
        setPostView((prevPostView) => ({
          ...prevPostView,
          comments: [...news.data, ...(prevPostView.comments || [])],
        }));
      }
    }
    const newsInterval = setInterval(updateCommentsTimeline, 2000)
    // fetchPosts()
    return () => {
      clearInterval(newsInterval)
    }
  }, [setPostView, api, comments])



  if (loading) {
    return (
      <Flex w="100%" h="100%" alignItems={'center'} justifyContent={'center'}>
        loading...
      </Flex>
    )
  }

  if (!post) {
    return (
      <Flex w="100%" h="100%" alignItems={'center'} justifyContent={'center'}>
        Post not found
      </Flex>
    )
  }

  return (
    <Stack direction={'column'} gap={8} w="100%" alignItems={'center'}>
      <Post
        key={post.key}
        content={post.data.content}
        comments={post.data.comments}
        views={post.data.views}
        likes={post.data.likes}
        postId={post.key}
        userId={post.data.userKey}
        username={post.data.username}
        onLike={like}
        hasLike={post.data.hasLike}
        loadingLike={false}
      />
      <PostBox {...inputBox} buttonText="Comment" placeholder="Put your comment..." onSubmit={comment} loading={loadingSend} />
      <CommentsSection comments={comments} />
      {!commentsUpdated && <Button
        variant={'outline'}
        size={'sm'}
        onClick={loadMoreComments}
        loading={commentsLoading}
      >
        Load more comments <LuChevronsDown />
      </Button>}

    </Stack>
  )
}
export default memo(PostView) 