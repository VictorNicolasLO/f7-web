import { Box,  IconButton, Input, InputGroup, Link,  VStack } from '@chakra-ui/react'
import { memo } from 'react'
import { LuSearch, LuStar } from 'react-icons/lu'

const ProfileSearcher = memo(() => {
    return (
        <Box position="relative" flex={1} maxWidth={'sm'}>
            <InputGroup maxW={'sm'} startElement={<LuSearch />}>
                <Input placeholder="Search profiles" />
            </InputGroup>
            <Box
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
                    {new Array(5).fill(0).map((_, i) => (
                        <Box
                            key={i}
                            px={4}
                            py={2}
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                        >
                            <Link href="#">{'@caffeine_addict#a23A'}</Link>
                            <IconButton
                                aria-label="Search database"
                                variant="outline"
                                size={'xs'}
                             
                            >
                                <LuStar />
                            </IconButton>
                        </Box>
                    ))}


                </VStack>
            </Box>
        </Box>

    )
})

export default ProfileSearcher