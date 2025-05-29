import { Card, Flex, LinkBox, LinkOverlay, Stack, Text } from "@chakra-ui/react"
import { memo } from "react"



const Comment = memo(({})  => {
    const cardJsx = <Card.Root  >
        <Card.Body >
            <Text fontSize={'md'}>Goood post!</Text>
            <Card.Description>
                @caffeine_addict
            </Card.Description>
        </Card.Body>

    </Card.Root>
    return (
        <Flex align={"center"} justify="center" >
            <Stack width={'xl'} maxWidth={'xl'} >
                <LinkBox>
                    {cardJsx}
                    <LinkOverlay href="#"/>
                </LinkBox>

            </Stack>
        </Flex>

    )
})
export default Comment