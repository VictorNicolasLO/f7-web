import { Button, Flex, Stack, Textarea } from "@chakra-ui/react"

const PostBox = () => {
    return <Flex align={"center"} justify="center">
        <Stack width={'xl'} maxWidth={'xl'} padding={4} >
            <Textarea placeholder="Tell us what you think..." size={'lg'} resize="none" maxLength={280} autoresize={true} maxH="8lh"/>
            <Button alignSelf={'self-start'} type="button" width={'30%'}  variant={'outline'} size={'lg'} >Post</Button>
        </Stack>
    </Flex>
}
export default PostBox