import { Flex, Grid, GridItem, Heading, Input, InputGroup, Separator, Tabs } from "@chakra-ui/react"
import { memo } from "react"
import { LuSearch, LuStar, LuGlobe } from "react-icons/lu"

export type TopBarProps = {
    onChangeTab?: (tab: string) => void,
    tab?: string
}

const SearchInput = memo(() => {
    return <Flex gap={6} align="center" justify={'flex-start'} minW={'300px'}>
        <Heading minW={
            'fit-content'
        } size="2xl">Fast 7</Heading>
        <InputGroup maxW={'sm'} startElement={<LuSearch />}>
            <Input placeholder="Search profiles" />
        </InputGroup>
    </Flex>
})

const TopBar = ({ onChangeTab, tab }: TopBarProps) => {
    console.log('render topbar', tab)    
    return (
        <Flex position="sticky" pos={'sticky'} top={0} zIndex={1000} background={'rgb(255,255,255, .9)'} backdropFilter={'blur(2px);'} flexDirection={'column'}>
            <Grid templateColumns={'1fr auto 1fr'} padding={4}>
                <GridItem gridColumn={'1'} alignContent={'center'}>
                    <SearchInput />
                </GridItem>
                <GridItem gridColumn={'2'}>
                    <Flex gap={4} align="center" justify={'center'} alignSelf={'center'} >
                        <Tabs.Root variant={'enclosed'} onValueChange={({ value }) => onChangeTab && onChangeTab(value)} activationMode="manual" size={'lg'} value={tab || "none"} sm={{"& *": {
                            shadow:'none'
                        }}} >
                            <Tabs.List>
                                <Tabs.Trigger value="news">
                                    <LuGlobe />
                                    News
                                </Tabs.Trigger>
                                <Tabs.Trigger value="feed">
                                    <LuStar />
                                    Feed
                                </Tabs.Trigger>

                            </Tabs.List>

                        </Tabs.Root>
                    </Flex>
                </GridItem>
            </Grid>
            <Separator />
        </Flex>

    )
}
export default TopBar