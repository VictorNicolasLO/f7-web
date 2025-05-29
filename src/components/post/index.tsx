import { Card, Flex, IconButton, LinkBox, LinkOverlay, Stack, Text } from "@chakra-ui/react"
import { memo } from "react"
import { LuThumbsUp, LuEye, LuMessageCircle } from "react-icons/lu"


const Post = memo(({})  => {

  

    const cardJsx = <Card.Root size={'lg'} >
        <Card.Body>
            <Card.Title>“Just had coffee and now I can hear colors”</Card.Title>
            <Card.Description>
                @caffeine_addict
            </Card.Description>
        </Card.Body>

    </Card.Root>
    return (
        <Flex align={"center"} justify="center" >
            <Stack width={'xl'} maxWidth={'xl'}  >
                <LinkBox>
                    {cardJsx}
                    <LinkOverlay href="#"/>
                </LinkBox>
                <Stack direction={'row'} gap={1} align="center" justify="flex-start">
                    <Stack direction={'column'} gap={1} align="center" justify="space-between">
                        <IconButton aria-label="Search database" variant={'ghost'}>
                            <LuMessageCircle />
                        </IconButton>
                        <Text userSelect={'none'}>25</Text>
                    </Stack>
                    <Stack direction={'column'} gap={1} align="center" justify="space-between">
                        <IconButton aria-label="Search database" variant={'ghost'}>
                            <LuThumbsUp />
                        </IconButton>
                        <Text userSelect={'none'}>46</Text>
                    </Stack>
                    <Stack direction={'column'} gap={1} align="center" justify="space-between">
                        <IconButton aria-label="Search database" variant={'ghost'}>
                            <LuEye />
                        </IconButton>
                        <Text userSelect={'none'}>300</Text>
                    </Stack>

                </Stack>
            </Stack>
        </Flex>

    )
})
export default Post