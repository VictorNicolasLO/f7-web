import { useCallback, useEffect, useRef, useState } from "react"
import { useApi } from "./user-api"
import { Flash7Api } from "../api/flash7Api"

export type TimelineOptions = { type: 'GLOBAL' } | { type: 'PROFILE', userKey: string }


const FETCH_POSTS_LIMIT = 10
const fetchPosts = async (api: Flash7Api, options: TimelineOptions, lastPostKey?: string, limit: number = FETCH_POSTS_LIMIT, reverse?: boolean,) => {
    if (options.type === 'GLOBAL') {
        return await api.globalFeed(lastPostKey, limit, reverse)
    } else if (options.type === 'PROFILE') {
        return await api.userTimeline(options.userKey, lastPostKey, limit, reverse)
    }
    throw new Error('Invalid timeline options')
}

export const useTimeline = (options: TimelineOptions) => {
    const api = useApi()
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [upToDate, setUpToDate] = useState<boolean>(false)
    const loaderRef = useRef(null)
    const [loadinLikes, setLoadingLikes] = useState<Record<string, boolean>>({})
    const postRefs = useRef<Record<string, any>>([]);
    const firstFetchRef = useRef<boolean>(false);

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
                        api.view((entry.target as any).__item.key).then(() => {
                            console.log('Post view recorded:', (entry.target as any).__item.key);
                        });

                    }
                });
            },
            { threshold: 0.75 } // Trigger when 50% is visible
        );

        posts.forEach((item: any) => {

            const r = postRefs.current[item.key];
            r.__item = item; // Store the item in the ref for later use
            if (r && !item.data.hasView) {
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
        const news = await fetchPosts(api, options, lastPost?.key, FETCH_POSTS_LIMIT)
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
        if (firstFetchRef.current === false) {
            firstFetchRef.current = true;
            console.log('First fetch completed, setting up to date')
            setLoading(false)
        } else {
            console.log('Subsequent fetch completed, setting loading to false')
            setTimeout(() => { setLoading(false) }, 500)
        }


    }, [posts, loading, api])



    useEffect(() => {
        const updateTimeline = async () => {
            if (!firstFetchRef.current) {
                return;
            }
            const firstPost = posts[0];
            const news = await fetchPosts(api, options, firstPost?.key, FETCH_POSTS_LIMIT, false)
            console.log('Updating timeline', news)
            if (firstPost) {
                setPosts((prevPosts) => [...news.data.filter((post: any) => post.key !== firstPost.key), ...prevPosts]);
            } else {
                setPosts((prevPosts) => [...news.data, ...prevPosts]);
            }
        }
        const newsInterval = setInterval(updateTimeline, 2000)
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
    return {
        posts,
        loading,
        upToDate,
        loaderRef,
        loadMorePosts,
        setRef,
        handleLike,
        loadinLikes
    }
}