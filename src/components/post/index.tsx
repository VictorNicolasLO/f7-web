import { Button, Card, Flex, Link, Stack, Text } from "@chakra-ui/react"
import { formatDistanceToNow } from "date-fns"
import { memo, useMemo } from "react"
import { LuThumbsUp, LuEye, LuMessageCircle } from "react-icons/lu"
import { Link as RouterLink } from 'react-router-dom'
import { decodeTime, isValid } from 'ulid'

type PostProps = {
    content: string
    username: string,
    userId: string,
    postId: string,
    likes: number,
    comments: number,
    views: number,
    onLike?: (postId: string) => any,
    hasLike?: boolean
    hasView?: boolean,
    loadingLike?: boolean,
    setRef?: (postId: string, ref: any) => void
}

const Post = memo(({ content,
    username,
    userId,
    postId,
    likes,
    comments,
    views,
    onLike,
    hasLike,
    hasView,
    setRef
}: PostProps) => {
    const ulidTime = useMemo(() => isValid(postId) ? new Date(decodeTime(postId)) : new Date(), [postId])
    const cardJsx = useMemo(() => (<Card.Root size={'lg'} >
        <Card.Body gap={1} >
            <Card.Title>
                <Link asChild>
                    <RouterLink to={`/post-view/${postId}`} style={{ wordBreak: 'break-word' }} >“{content}”</RouterLink>
                </Link>
            </Card.Title>
            <Stack gap={0}>
                <Link asChild textStyle={'sm'}>
                    <RouterLink to={`/profile-timeline/${userId}`}>@{username}</RouterLink>
                </Link>
                {<Text textStyle={'xs'}>{formatDistanceToNow(ulidTime, { addSuffix: true })}</Text>}
            </Stack>
        </Card.Body>

    </Card.Root>), [content, postId, userId, username, ulidTime])


    return (
        <Flex align={"center"} justify="center" ref={(r) => setRef && setRef(postId, r)} width='100%' maxWidth={'xl'} paddingX={{ smDown: 2 }}>
            <Stack w='100%' >

                {cardJsx}

                <Stack direction={'row'} gap={0} align="center" justify="flex-start">
                    <Stack direction={'column'} gap={1} align="center" justify="space-between">
                        <Button aria-label="Search database" variant={'ghost'} asChild>
                            <RouterLink to={`/post-view/${postId}`}> <LuMessageCircle /> {comments || 0}</RouterLink>
                        </Button>
                    </Stack>
                    <Stack direction={'column'} gap={1} align="center" justify="space-between">
                        <Button aria-label="Search database" variant={'ghost'} onClick={() => onLike && onLike(postId)} color={hasLike ? 'flash7' : "current"} >
                            <LuThumbsUp /> <Text userSelect={'none'}>{likes || 0}</Text>
                        </Button>

                    </Stack>
                    <Stack direction={'column'} gap={1} align="center" justify="space-between">
                        <Button aria-label="Search database" variant={hasView ? 'solid' : 'ghost'} >
                            <LuEye /> <Text userSelect={'none'}>{views || 0}</Text>
                        </Button>

                    </Stack>

                </Stack>
            </Stack>
        </Flex>

    )
})
export default Post