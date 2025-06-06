import { Flex, For, Spinner } from "@chakra-ui/react"
import Post from "../../../../../../components/post"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { useApi } from "../../../../../../hooks/user-api"
const FETCH_POSTS_LIMIT = 10
const News = () => {
    const api = useApi()
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [upToDate, setUpToDate] = useState<boolean>(false)
    const loaderRef = useRef(null)
    const [loadinLikes, setLoadingLikes] = useState<Record<string, boolean>>({})
    const postRefs = useRef<Record<string, any>>([]);


    const setRef = useCallback((postId: string, ref: any) => {
        postRefs.current[postId] = ref;
    }, [postRefs]);

    useEffect(() => {
        
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        (entry.target as any).__item.data.hasView = true;
                        observer.unobserve(entry.target); 
                        api.view((entry.target as any).__item.key).then(()=>{
                            console.log('Post view recorded:', (entry.target as any).__item.key);
                        });
                       // entry.target.classList.add('visible');
                    } else {
                       // entry.target.classList.remove('visible');
                    }
                });
            },
            { threshold: 0.75 } // Trigger when 50% is visible
        );
        
        posts.forEach((item: any) => {
            
            const r = postRefs.current[item.key];
            r.__item = item; // Store the item in the ref for later use
            if (r && !item.data.hasView){
                 observer.observe(r)
            };
        });

        return () => {
            observer.disconnect();
        };
    }, [posts, setPosts, api]);

    const loadMorePosts = useCallback(async () => {
        if (loading || upToDate) return;
        setLoading(true)
        const lastPost = posts[posts.length - 1];
        const news = await api.globalFeed(lastPost?.key, FETCH_POSTS_LIMIT)
        console.log('Loaded from infinite loading', news)
        if (lastPost) {
            if (news.data.length === 1) {
                setUpToDate(true);
                setLoading(false);
                return;
            }
            setPosts((prevPosts) => [...prevPosts, ...news.data.filter((post: any) => post.key !== lastPost.key)]);
            if (news.data.length < FETCH_POSTS_LIMIT) {
                setUpToDate(true);
            }
        } else {
            setPosts((prevPosts) => [...prevPosts, ...news.data]);
        }

        setTimeout(() => { setLoading(false) }, 500)

    }, [posts, loading, api])



    useEffect(() => {
        const updateTimeline = async () => {

            const firstPost = posts[0];
            const news = await api.globalFeed(firstPost?.key, FETCH_POSTS_LIMIT, false)
            console.log('Updating timeline', news)
            if (firstPost) {
                setPosts((prevPosts) => [...news.data.filter((post: any) => post.key !== firstPost.key), ...prevPosts]);
            } else {
                setPosts((prevPosts) => [...news.data, ...prevPosts]);
            }
        }
        const newsInterval = setInterval(updateTimeline, 5000)
        // fetchPosts()
        return () => {
            clearInterval(newsInterval)
        }
    }, [setPosts, api, posts])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMorePosts();
                }
            },
            { rootMargin: '0px' }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [loadMorePosts]);

    const handleLike = useCallback(async (postId: string) => {
        console.log('Liking post', postId)
        setLoadingLikes((prevLikes) => ({ ...prevLikes, [postId]: true }));
        await api.like(postId)
        setPosts((prevPosts) => prevPosts.map((post) => {


            if (post.key === postId) {
                const isLiked = post.data.hasLike;
                console.log('Post before like toggle', post)
                const currentLikes = post.data.likes || 0;
                return {
                    ...post,
                    data: {
                        ...post.data,
                        likes: isLiked ? currentLikes - 1 : currentLikes + 1,
                        hasLike: !isLiked
                    }
                }
            }
            return post;
        }))
        setLoadingLikes((prevLikes) => ({ ...prevLikes, [postId]: false }));
    }, [api])


    console.log(posts)
    return (
        <>
            <Flex flexDirection={'column'} gap={8} alignItems={'center'} justifyContent={'center'}>
                {posts.map((post) => <Post
                    key={post.key}
                    content={post.data.content}
                    comments={post.data.comments}
                    views={post.data.views}
                    likes={post.data.likes}
                    postId={post.key}
                    userId={post.data.userKey}
                    username={post.data.username}
                    onLike={handleLike}
                    hasLike={post.data.hasLike}
                    loadingLike={loadinLikes[post.key] || false}
                    setRef={setRef}
                />)}
                {!upToDate && <div >
                    {loading ? <Spinner size={'xl'} color={'blue.500'} /> : <div ref={loaderRef} style={{ width: '60px', height: '60px' }} />}
                </div>}



            </Flex>

        </>
    )
}
export default memo(News)