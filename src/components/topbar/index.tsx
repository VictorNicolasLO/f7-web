import { Flex, Grid, GridItem, Heading, Link, Separator, Tabs } from "@chakra-ui/react"
import { memo, useMemo } from "react"
import { LuStar, LuGlobe } from "react-icons/lu"
import ProfileSearcher from "../profile-searcher"
import { Link as RouterLink } from "react-router-dom"
import { useProfileSearcher } from "../profile-searcher/hooks/user-profile-searcher"
export type TopBarProps = {
    onChangeTab?: (tab: string) => void,
    tab?: string,
    username: string,
    userId: string,
    profileSearcher: ReturnType<typeof useProfileSearcher>
}

const SearchInput = memo((props: ReturnType<typeof useProfileSearcher>) => {
    return (<GridItem gridColumn={'1'} alignContent={'center'}>
        <Flex gap={6} align="center" justify={'flex-start'} minW={'300px'}>
            <RouterLink to={'/feed/news'}>
                        <Heading minW={
                'fit-content'
            } size="2xl">Flash 7</Heading>
            </RouterLink>

            <ProfileSearcher
                {...props}
            />
        </Flex>
    </GridItem>)
})



const TopBar = ({ onChangeTab, tab, username, userId, profileSearcher }: TopBarProps) => {
    console.log('render topbar', tab)


    const tabs = useMemo(() => <GridItem gridColumn={'2'}>
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
    </GridItem>, [onChangeTab, tab])


    const welcome = useMemo(() =>                 <GridItem gridColumn={'3'}>
                    <Flex justify={'flex-end'} align="center" gap={4} minW={'300px'} height={'100%'}>
                        <Heading size="md">Welcome {' '}
                            <Link colorPalette={'teal'} asChild>
                                <RouterLink to={`/profile-timeline/${userId}`}>{username}</RouterLink>
                            </Link>
                        </Heading>
                    </Flex>
                </GridItem>, [username, userId])

    return (
        <Flex position="sticky" pos={'sticky'} top={0} zIndex={1000} bg="bg/90" backdropBlur={'lg'} backdropFilter={'blur(2px)'} flexDirection={'column'}>
            <Grid templateColumns={'1fr auto 1fr'} padding={4}>

                <SearchInput {...profileSearcher} />
                {tabs}

                {welcome}
            </Grid>
            <Separator />
        </Flex>

    )
}
export default memo(TopBar) 