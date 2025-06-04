import { Button, Flex, Text } from "@chakra-ui/react"
import Post from "../../../../components/post"
import { LuStar, LuLogOut } from "react-icons/lu"
import { useParams } from 'react-router-dom'
import { useAuthenticatedAuth } from "../../../../hooks/use-auth"
import { fromBase64Url } from "../../../../utils/base64-serdes"
const ProfileTimeline = () => {
    const params = useParams()
    const auth = useAuthenticatedAuth()

    const userIdParam = fromBase64Url(params.id as string)
    const isCurrentUser = userIdParam === auth.state.userIdB64
    const username = isCurrentUser ? auth.state.username : params.id

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
                        <Button variant={'outline'} size={'sm'}>Follow <LuStar /></Button>
                    </Flex>
            }

            <Flex flexDirection={'column'} gap={8} alignItems={'center'} justifyContent={'center'}>
                {new Array(10).fill(0).map((_, i) => <Post />)}
            </Flex>

        </Flex>
    )
}
export default ProfileTimeline