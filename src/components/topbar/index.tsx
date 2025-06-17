import { Em, Flex, Grid, GridItem, Heading, Link, Separator, Tabs, Text } from "@chakra-ui/react"
import { memo, useMemo } from "react"
import { LuStar, LuGlobe } from "react-icons/lu"
import ProfileSearcher from "../profile-searcher"
import { Link as RouterLink } from "react-router-dom"
import { useProfileSearcher } from "../profile-searcher/hooks/user-profile-searcher"
import { useMediaQuery } from "usehooks-ts"
export type TopBarProps = {
    onChangeTab?: (tab: string) => void,
    tab?: string,
    username: string,
    userId: string,
    profileSearcher: ReturnType<typeof useProfileSearcher>
}

const SearchInput = memo((props: ReturnType<typeof useProfileSearcher>) => {
    return (
        <Flex gap={6} align="center" justify={'flex-start'} minW={'300px'}>
            <RouterLink to={'/feed/news'}>
                <Heading minW={
                    'fit-content'
                } size="3xl" textStyle={'title'} >Flash 7</Heading>
            </RouterLink>

            <ProfileSearcher
                {...props}
            />
        </Flex>)
})



const TopBar = ({ onChangeTab, tab, username, userId, profileSearcher }: TopBarProps) => {
    console.log('render topbar', tab)

    const matches = useMediaQuery('(min-width: 860px)')

    const tabs = useMemo(() =>
        <Flex gap={4} align="center" justify={'center'} alignSelf={'center'} >
            <Tabs.Root variant={'enclosed'} onValueChange={({ value }) => onChangeTab && onChangeTab(value)} activationMode="manual" size={{ base: 'lg', smDown: 'sm' }} value={tab || "none"} sm={{
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
        </Flex>,
        [onChangeTab, tab])


    const welcome = useMemo(() =>
        <Flex justify={matches ? 'flex-end' : 'center'} align="center" gap={4} minW={'300px'} height={'100%'}>
            <Heading size="md" > <Em textStyle={'title'} fontStyle={'initial'} fontSize={'md'} >Welcome</Em>  {' '}
                <Link colorPalette={'teal'} asChild>
                    <RouterLink to={`/profile-timeline/${userId}`}>{username}</RouterLink>
                </Link>
            </Heading>
        </Flex>, [username, userId, matches])


    if (!matches) {
        return <Flex zIndex={1000} bg="bg/90" backdropBlur={'lg'} backdropFilter={'blur(4px)'} flexDirection={'column'}>
            <Flex direction={'column'} padding={4} gap={4} alignItems={'center'} justify={'center'}>
                <Flex alignContent={'center'} marginRight={2}>
                    <SearchInput {...profileSearcher} />
                </Flex>

                <Flex >
                    {welcome}
                </Flex>
                <Flex >
                    {tabs}
                </Flex>
            </Flex>
            <Separator />
        </Flex>
    }



    return (
        <Flex position="sticky" pos={'sticky'} top={0} zIndex={1000} bg="bg/90" backdropBlur={'lg'} backdropFilter={'blur(4px)'} flexDirection={'column'}>
            <Grid templateColumns={'1fr auto 1fr'} padding={4}>
                <GridItem gridColumn={'1'} alignContent={'center'} marginRight={2}>
                    <SearchInput {...profileSearcher} />
                </GridItem>
                <GridItem gridColumn={'2'}>
                    {tabs}
                </GridItem>
                <GridItem gridColumn={'3'}>
                    {welcome}
                </GridItem>
            </Grid>
            <Separator />
        </Flex>

    )
}
export default memo(TopBar) 