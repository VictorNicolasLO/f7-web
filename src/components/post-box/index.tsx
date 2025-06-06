import { Button, Flex, Stack, Textarea } from "@chakra-ui/react"
import { memo } from "react"
import {  LuPen } from "react-icons/lu"
type PostBoxProps = {
    placeholder?: string,
    buttonText?: string,
    loading?: boolean
    loadingText?: string,
    onValueChange?: (value: string) => void,
    value?: string,
    onSubmit?: (value?: string) => void
}

const PostBox = ({
    buttonText,
    placeholder,
    loading,
    loadingText,
    onValueChange,
    value,
    onSubmit
}: PostBoxProps) => {
    return <Flex align={"center"} justify="center" width='100%' maxWidth={'xl'} paddingX={{smDown: 2}}>
        <Stack w='100%' >
            <Textarea disabled={loading} placeholder={placeholder ?? "This will disappear in 7 days. Say anything..."} size={'xl'} resize="none" maxLength={280} autoresize={true} maxH="8lh" onInput={(e) => onValueChange && onValueChange((e.target as HTMLTextAreaElement).value)} value={value}/>
            <Button alignSelf={'self-start'} type="button" variant={'outline'} size={'md'} loading={loading} loadingText={loadingText ?? 'Posting...'} onClick={()=>onSubmit && onSubmit(value)}>{buttonText ?? 'Post'} <LuPen/></Button>
        </Stack>
    </Flex>
}
export default memo(PostBox)