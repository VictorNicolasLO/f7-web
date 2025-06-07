import { Card, Flex, Link, Stack, Text } from "@chakra-ui/react"
import { formatDistanceToNow } from "date-fns"
import { memo, useMemo } from "react"
import { Link as RouterLink } from 'react-router-dom'
import { decodeTime, isValid } from "ulid"

export type CommentProps = {
    userId: string
    username: string
    content:string,
    commentKey:string
}
const Comment = memo(({
userId,username,content, commentKey
 }:CommentProps) => {
    const ulidTime = useMemo(() => isValid(commentKey) ? new Date(decodeTime(commentKey)) : new Date(), [commentKey])
    const cardJsx = <Card.Root  >
        <Card.Body >
            <Text fontSize={'md'}>{content}</Text>
            <Link asChild textStyle={'sm'}>
                <RouterLink to={`/profile-timeline/${userId}`}>@{username}</RouterLink>
            </Link>
            {<Text textStyle={'xs'}>{formatDistanceToNow(ulidTime, { addSuffix: true })}</Text>}
        </Card.Body>

    </Card.Root>
    return (
        <Flex align={"center"} justify="center" >
            <Stack width={'xl'} maxWidth={'xl'} >

                    {cardJsx}

            </Stack>
        </Flex>

    )
})
export default Comment