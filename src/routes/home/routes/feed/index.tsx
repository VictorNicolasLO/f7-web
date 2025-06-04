import { memo, useCallback, useState } from "react"
import FeedRouter from "./router"
import PostBox from "../../../../components/post-box"
import { Flex, Stack } from "@chakra-ui/react"
import { useInput } from "../../../../hooks/use-input"
import { useApi } from "../../../../hooks/user-api"
import { ulid } from "ulid"

const Feed = () => {
  const input = useInput('')
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const sendPost = useCallback(async (value?:string) => {
    if (!value || value.trim() === '') {
      return
    }
    setLoading(true)
    await api.post(ulid(), value )
    input.reset()
    setLoading(false)
  }, [])
  return (
    <Stack gap={8}>
      <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
        <PostBox {...input} onSubmit={sendPost} loading={loading}/>
      </Flex>
      <FeedRouter />
    </Stack>

  )
}
export default memo(Feed)