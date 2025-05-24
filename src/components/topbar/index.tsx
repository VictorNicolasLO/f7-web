import { Flex, Heading, Input, InputGroup, Kbd, Tabs } from "@chakra-ui/react"
import { LuFolder, LuSearch, LuStar, LuUser, LuGlobe } from "react-icons/lu"

const TopBar = () => {
    return (
        <Flex gap={4} align="center" justify="space-between" padding={4} wrap={'wrap-reverse'} position="sticky" pos={'sticky'} top={0} zIndex={1000} background={'white'} paddingBottom={4}>
            <Flex flex={1} gap={4} align="center" justify={'flex-start'} minW={'300px'}>
                 <Heading size="2xl">Fast 7</Heading>
                <InputGroup maxW={'sm'} startElement={<LuSearch />}>
                    <Input placeholder="Search profiles" />
                </InputGroup>
            </Flex>
            <Flex flex={1.25} gap={4} align="center" justify={'flex-start'}>
                <Tabs.Root defaultValue="members" variant={'subtle'} onValueChange={(value) => console.log(value)} activationMode="manual" size={'lg'}>
                    <Tabs.List>
                        <Tabs.Trigger value="members">
                            <LuGlobe />
                            News
                        </Tabs.Trigger>
                        <Tabs.Trigger value="projects">
                            <LuStar />
                            Feed
                        </Tabs.Trigger>
                       
                    </Tabs.List>

                </Tabs.Root>
            </Flex>

        </Flex>
    )
}
export default TopBar