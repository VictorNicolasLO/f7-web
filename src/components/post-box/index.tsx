import { Button, Flex, Stack, Textarea } from "@chakra-ui/react"
import { memo } from "react"

type PostBoxProps = {
    placeholder?: string,
    buttonText?: string,
    loading?: boolean
    loadingText?: string
}

const PostBox = ({

    buttonText,
    placeholder,
    loading,
    loadingText
}: PostBoxProps) => {
    console.log('render postbox')
    return <Flex align={"center"} justify="center">
        <Stack width={'xl'} maxWidth={'xl'}  >
            <Textarea placeholder={placeholder ?? "This will disappear in 7 days. Say anything..."} size={'xl'} resize="none" maxLength={280} autoresize={true} maxH="8lh" />
            <Button alignSelf={'self-start'} type="button" width={'30%'} variant={'outline'} size={'md'} loading={loading} loadingText={loadingText ?? 'Posting...'} >{buttonText ?? 'Post'}</Button>
        </Stack>
    </Flex>
}
export default memo(PostBox)