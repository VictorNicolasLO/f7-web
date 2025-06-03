import { Flex, Grid, GridItem, Heading,Separator, Tabs } from "@chakra-ui/react"
import { memo } from "react"
import { LuStar, LuGlobe } from "react-icons/lu"
import ProfileSearcher from "../profile-searcher"

export type TopBarProps = {
    onChangeTab?: (tab: string) => void,
    tab?: string
}

const SearchInput = memo(() => {
    return (<GridItem gridColumn={'1'} alignContent={'center'}>
        <Flex gap={6} align="center" justify={'flex-start'} minW={'300px'}>
            <Heading minW={
                'fit-content'
            } size="2xl">Fast 7</Heading>
            <ProfileSearcher />
        </Flex>
    </GridItem>)
})

const TopBar = ({ onChangeTab, tab }: TopBarProps) => {
    console.log('render topbar', tab)
    return (
        <Flex position="sticky" pos={'sticky'} top={0} zIndex={1000} bg="bg/90" backdropBlur={'lg'} backdropFilter={'blur(2px)'} flexDirection={'column'}>
            <Grid templateColumns={'1fr auto 1fr'} padding={4}>

                <SearchInput />

                <GridItem gridColumn={'2'}>
                    <Flex gap={4} align="center" justify={'center'} alignSelf={'center'} >
                        <Tabs.Root variant={'enclosed'} onValueChange={({ value }) => onChangeTab && onChangeTab(value)} activationMode="manual" size={'lg'} value={tab || "none"} sm={{
                            "& *": {
                                shadow: 'none'
                            }
                        }} >
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