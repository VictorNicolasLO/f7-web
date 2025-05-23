import './App.css';
import {
  Box, Flex, VStack, HStack, Input, Button, Text, Avatar, Textarea, useDisclosure, List, ListItem, Spacer, Separator,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, TabsRoot, TabsList, TabsTrigger, TabsContent
} from '@chakra-ui/react';
import { FaUser, FaRegComment, FaRegHeart, FaSearch, FaPlus } from 'react-icons/fa';
import { useState } from 'react';

const users = [
  { username: '@midnight', name: 'Midnight', avatar: '' },
  { username: '@caffeine_adict', name: 'Caffeine Adict', avatar: '' },
  { username: '@earlybird', name: 'Early Bird', avatar: '' },
];

const posts = [
  { id: 1, user: users[0], content: 'Why do I always get hungry after brushing my teeth?', comments: 3, likes: 12 },
  { id: 2, user: users[1], content: 'Coffee is life.', comments: 1, likes: 8 },
  { id: 3, user: users[2], content: 'Good morning world!', comments: 0, likes: 5 },
];

function LoginScreen({ onLogin }) {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.100">
      <Box bg="white" p={8} rounded="md" boxShadow="md" minW="340px">
        <VStack spacing={4} align="stretch">
          <Input placeholder="Email" type="email" size="sm" />
          <Input placeholder="Password" type="password" size="sm" />
          <Button colorScheme="blackAlpha" bg="black" color="white" _hover={{ bg: 'gray.700' }} onClick={onLogin} size="sm">Sign In</Button>
        </VStack>
        <Button variant="link" mt={2} colorScheme="blackAlpha" size="xs">Forgot password?</Button>
      </Box>
      <Box pos="fixed" left={0} right={0} bottom={0} h="48px" bg="black" />
    </Flex>
  );
}

function Sidebar({ onProfileSelect }) {
  return (
    <Box w="260px" bg="white" borderRight="1px solid #e5e5e5" color="black" p={6} minH="100vh">
      <HStack justify="space-between" mb={2}>
        <Text fontWeight="bold" fontSize="md">Profiles</Text>
        <Button size="xs" variant="ghost" colorScheme="gray">×</Button>
      </HStack>
      <Input placeholder="Search profiles" size="sm" mb={4} />
      <VStack align="stretch" spacing={2}>
        {users.map(u => (
          <HStack key={u.username} justify="space-between">
            <HStack>
              <Avatar.Root><Avatar.Fallback name={u.name} /></Avatar.Root>
              <Text fontSize="sm">{u.username}</Text>
            </HStack>
            <Button size="xs" colorScheme="blackAlpha" variant="outline" onClick={() => onProfileSelect(u)} fontWeight={400}>Follow</Button>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

function Feed({ onPostClick }) {
  return (
    <VStack align="stretch" spacing={4}>
      {posts.map(post => (
        <Box key={post.id} bg="white" border="1px solid #e5e5e5" p={4} rounded="md" boxShadow="none" cursor="pointer" onClick={() => onPostClick(post)}>
          <HStack mb={2}>
            <Avatar.Root><Avatar.Fallback name={post.user.name}/></Avatar.Root>
            <Text fontWeight="medium" fontSize="sm" color="gray.700">{post.user.username}</Text>
          </HStack>
          <Text fontSize="md" mb={2} color="black">{post.content}</Text>
          <HStack spacing={6} color="gray.400" fontSize="xs">
            <HStack><FaRegComment /><Text ml={1}>{post.comments}</Text></HStack>
            <HStack><FaRegHeart /><Text ml={1}>{post.likes}</Text></HStack>
            <Text ml={2}>24</Text><Text ml={2}>55</Text><Text ml={2}>127</Text>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}

function ProfileView({ user, onBack }) {
  return (
    <Box>
      <Button mb={4} onClick={onBack} size="sm" variant="ghost">Back</Button>
      <HStack mb={4}>
        <Text fontWeight="extrabold" fontSize="3xl">{user.username}</Text>
        <Button size="xs" variant="ghost">☆</Button>
      </HStack>
      <VStack align="stretch" spacing={4}>
        {posts.map(post => (
          <Box key={post.id} bg="white" border="1px solid #e5e5e5" p={4} rounded="md">
            <Text fontSize="md" color="black">{post.content}</Text>
            <Text fontSize="xs" color="gray.500" mt={1}>{post.user.username}</Text>
            <HStack spacing={6} color="gray.400" fontSize="xs" mt={2}>
              <HStack><FaRegComment /><Text ml={1}>24</Text></HStack>
              <HStack><FaRegHeart /><Text ml={1}>55</Text></HStack>
              <Text ml={2}>127</Text>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

function PostDetailModal({ post, isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent bg="white" color="black" maxW="400px">
        <DialogHeader fontWeight="bold" fontSize="md">{post.content}</DialogHeader>
        <Text fontSize="sm" color="gray.500" mb={2}>{post.user.username}</Text>
        <DialogBody>
          <HStack spacing={6} color="gray.400" fontSize="xs" mb={2}>
            <HStack><FaRegComment /><Text ml={1}>24</Text></HStack>
            <HStack><FaRegHeart /><Text ml={1}>55</Text></HStack>
            <Text ml={2}>127</Text>
          </HStack>
          <Input placeholder="Comment here..." mb={4} size="sm" />
          <VStack align="stretch" spacing={2}>
            <Box border="1px solid #e5e5e5" rounded="md" p={2} fontSize="sm" color="gray.700">"Why do I always get hungry after brushing my teeth?"<Text as="span" color="gray.400" fontSize="xs">@midnight</Text></Box>
            <Box border="1px solid #e5e5e5" rounded="md" p={2} fontSize="sm" color="gray.700">"Why do I always get hungry after brushing my teeth?"<Text as="span" color="gray.400" fontSize="xs">@midnight</Text></Box>
            <Box border="1px solid #e5e5e5" rounded="md" p={2} fontSize="sm" color="gray.700">"Why do I always get hungry after brushing my teeth?"<Text as="span" color="gray.400" fontSize="xs">@midnight</Text></Box>
            <Box border="1px solid #e5e5e5" rounded="md" p={2} fontSize="sm" color="gray.700">"Why do I always get hungry after brushing my teeth?"<Text as="span" color="gray.400" fontSize="xs">@midnight</Text></Box>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button onClick={onClose} size="sm" colorScheme="blackAlpha">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handlePostClick = post => {
    setSelectedPost(post);
    onOpen();
  };

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return (
    <Flex bg="gray.100" minH="100vh">
      <Sidebar onProfileSelect={setSelectedProfile} />
      <Box flex={1} p={10}>
        {!selectedProfile ? (
          <Box maxW="500px" mx="auto">
            <HStack justify="flex-end" mb={2}>
              <Avatar.Root size="sm"><Avatar.Fallback name="A" /></Avatar.Root>
            </HStack>
            <TabsRoot defaultValue="myfeed">
              <HStack justify="center" mb={4}>
                <TabsList borderRadius="md" bg="gray.50" border="1px solid #e5e5e5">
                  <TabsTrigger value="news">News</TabsTrigger>
                  <TabsTrigger value="myfeed">My feed</TabsTrigger>
                </TabsList>
              </HStack>
              <TabsContent value="myfeed">
                <Textarea placeholder="Write here" mb={4} bg="white" border="1px solid #e5e5e5" color="black" fontSize="sm" />
                <Button colorScheme="blackAlpha" bg="black" color="white" _hover={{ bg: 'gray.700' }} mb={8} size="sm">Post</Button>
                <Feed onPostClick={handlePostClick} />
              </TabsContent>
              <TabsContent value="news">
                <Feed onPostClick={handlePostClick} />
              </TabsContent>
            </TabsRoot>
          </Box>
        ) : (
          <Box maxW="500px" mx="auto">
            <ProfileView user={selectedProfile} onBack={() => setSelectedProfile(null)} />
          </Box>
        )}
      </Box>
      {selectedPost && (
        <PostDetailModal post={selectedPost} isOpen={isOpen} onClose={() => { setSelectedPost(null); onClose(); }} />
      )}
    </Flex>
  );
};

export default App;
