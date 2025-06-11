import { Box, Icon, Input, InputGroup, Link, Text, VStack } from '@chakra-ui/react'
import { memo } from 'react'
import { LuSearch, LuStar } from 'react-icons/lu'
import { Link as RouterLink } from 'react-router-dom'

type ProfileItem = {
    isFollowing: boolean,
    username: string,
    userKey: string
}

export type ProfileSearcherProps = {
    onValueChange?: (value: string) => void,
    value?: string,
    loading?: boolean
    profiles?: ProfileItem[],
    onFollow?: (userKey: string) => void,
    onContainerIn?: () => void,
    onContainerOut?: () => void,
    containerRef?: any,
    showResults?: boolean,
    resetSearcher?: () => void
}

const ProfileSearcher = memo(({
    onValueChange,
    value = '',
    profiles = [],
    onFollow,
    containerRef,
    onContainerIn,
    showResults,
    resetSearcher
}: ProfileSearcherProps) => {
    console.log('Search results', showResults)
    return (
        <Box position="relative" flex={1} maxWidth={'sm'} ref={containerRef} onClick={onContainerIn}>
            <InputGroup maxW={'sm'} startElement={<LuSearch />}>
                <Input placeholder="Search profiles" onInput={(e) => onValueChange && onValueChange((e.target as HTMLTextAreaElement).value)} value={value} />
            </InputGroup>
            {showResults && <Box
                position="absolute"
                top="100%"
                mt={2}
                width="100%"
                background={'Background'}
                boxShadow="xs"
                borderRadius="md"
                zIndex="dropdown"
            >
                <VStack align="stretch">
                    {profiles.map((profile) => (
                        <Box
                            key={profile.userKey}
                            px={4}
                            py={2}
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                        >
                            <Link asChild>
                                <RouterLink to={`/profile-timeline/${profile.userKey}`} onClick={() => resetSearcher && resetSearcher()} style={{maxWidth: '100%'}}>
                                <Text maxW={'100%'} truncate>{profile.username}</Text>
                                    
                                </RouterLink>
                            </Link>
                            <Icon
                                aria-label="Search database"
                                size={'xs'}
                                color={profile.isFollowing ? 'flash7' : 'initial'}
                                onClick={() => onFollow && onFollow(profile.userKey)}
                            >
                                <LuStar />
                            </Icon>
                        </Box>
                    ))}


                </VStack>
            </Box>}

        </Box>

    )
})

export default ProfileSearcher