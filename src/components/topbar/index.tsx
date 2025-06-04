import { Flex, Grid, GridItem, Heading, Link, Separator, Tabs } from "@chakra-ui/react"
import { memo, useMemo } from "react"
import { LuStar, LuGlobe } from "react-icons/lu"
import ProfileSearcher from "../profile-searcher"
import { toBase64Url } from "../../utils/base64-serdes"
import { Link as RouterLink } from "react-router-dom"
export type TopBarProps = {
    onChangeTab?: (tab: string) => void,
    tab?: string,
    username: string,
    userId: string
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

const TopBar = ({ onChangeTab, tab, username, userId }: TopBarProps) => {
    console.log('render topbar', tab)
    const userIdBase64 = useMemo(() => toBase64Url(userId), [userId])
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
                <GridItem gridColumn={'3'}>
                    <Flex justify={'flex-end'} align="center" gap={4} minW={'300px'} height={'100%'}>
                        <Heading size="md">Welcome {' '}
                            <Link colorPalette={'teal'} asChild>
                                <RouterLink to={`/profile-timeline/${userIdBase64}`}>{username}</RouterLink>
                            </Link>
                        </Heading>
                    </Flex>
                </GridItem>
            </Grid>
            <Separator />
        </Flex>

    )
}
export default TopBar