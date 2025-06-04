import { Card, Flex, IconButton, Link, Stack, Text } from "@chakra-ui/react"
import { memo } from "react"
import { LuThumbsUp, LuEye, LuMessageCircle } from "react-icons/lu"
import {Link as RouterLink} from 'react-router-dom'
type PostProps = {
    content: string
    username: string,
    userId: string,
    postId: string,
    likes: number,
    comments: number,
    views: number
}

const Post = memo(({content,
    username,
    userId,
    postId,
    likes,
    comments,
    views
} : PostProps)  => {

    const cardJsx = <Card.Root size={'lg'} >
        <Card.Body>
            <Card.Title><Link href="#">“{content}”</Link></Card.Title>
            <Card.Description>
            <Link asChild>
            <RouterLink to={`/profile-timeline/${userId}`}>@{username}</RouterLink>
                
            </Link>
            </Card.Description>
        </Card.Body>

    </Card.Root>
    return (
        <Flex align={"center"} justify="center" >
            <Stack width={'xl'} maxWidth={'xl'}  >
            
                    {cardJsx}
              
                <Stack direction={'row'} gap={1} align="center" justify="flex-start">
                    <Stack direction={'column'} gap={1} align="center" justify="space-between">
                        <IconButton aria-label="Search database" variant={'ghost'}>
                            <LuMessageCircle />
                        </IconButton>
                        <Text userSelect={'none'}>{comments || 0}</Text>
                    </Stack>
                    <Stack direction={'column'} gap={1} align="center" justify="space-between">
                        <IconButton aria-label="Search database" variant={'ghost'}>
                            <LuThumbsUp />
                        </IconButton>
                        <Text userSelect={'none'}>{likes || 0}</Text>
                    </Stack>
                    <Stack direction={'column'} gap={1} align="center" justify="space-between">
                        <IconButton aria-label="Search database" variant={'ghost'} >
                            <LuEye />
                        </IconButton>
                        <Text userSelect={'none'}>{views || 0}</Text>
                    </Stack>

                </Stack>
            </Stack>
        </Flex>

    )
})
export default Post