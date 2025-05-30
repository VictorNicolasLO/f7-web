import { Button, Flex, Text } from "@chakra-ui/react"
import Post from "../../../../components/post"
import { LuSearch, LuStar, LuGlobe } from "react-icons/lu"
const ProfileTimeline = () => {
    return (
        <Flex direction={'column'} gap={8} w="100%" alignItems={'center'}>
            <Flex width={'xl'} maxWidth={'xl'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                <Text fontSize={'5xl'} fontWeight={'bold'} textAlign={'center'}>@caffeine_addict#AC52</Text>
            </Flex>
            <Flex width={'xl'} maxWidth={'xl'} flexDirection={'column'} alignItems={'flex-end'} justifyContent={'flex-end'}>
                <Button variant={'outline'} size={'sm'}>Follow <LuStar/></Button>
            </Flex>
            <Flex flexDirection={'column'} gap={8} alignItems={'center'} justifyContent={'center'}>
                {new Array(10).fill(0).map((_, i) => <Post />)}
            </Flex>

        </Flex>
    )
}
export default ProfileTimeline