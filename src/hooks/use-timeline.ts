import { useCallback, useEffect, useRef, useState } from "react"
import { useApi } from "./use-api"
import { Flash7Api } from "../api/flash7Api"
import { useVisibilityChange } from "@uidotdev/usehooks"

export type TimelineOptions = { type: 'GLOBAL' } | { type: 'PROFILE', userKey: string } | { type: 'PERSONAL_FEED' }


const FETCH_POSTS_LIMIT = 10
const fetchPosts = async (api: Flash7Api, options: TimelineOptions, lastPostKey?: string, limit: number = FETCH_POSTS_LIMIT, reverse?: boolean,) => {
    if (options.type === 'GLOBAL') {
        return await api.globalFeed(lastPostKey, limit, reverse)
    } else if (options.type === 'PROFILE') {
        return await api.userTimeline(options.userKey, lastPostKey, limit, reverse)
    } else if (options.type === 'PERSONAL_FEED') {
        return await api.personalFeed(lastPostKey, limit, reverse)
    }
    throw new Error('Invalid timeline options')
}


const defaultState = {
    posts: [] as any[],
    loading: false,
    upToDate: false,
    loadingLikes: {} as Record<string, boolean>,
}

export const useTimeline = (options: TimelineOptions) => {
    const { api } = useApi()
    const isPageVisible = useVisibilityChange()
    const [state, setState] = useState(defaultState);
    const loaderRef = useRef(null)
    const postRefs = useRef<Record<string, any>>([]);
    const firstFetchRef = useRef<boolean>(false);

    const setRef = useCallback((postId: string, ref: any) => {
        postRefs.current[postId] = ref;
    }, [postRefs]);

    useEffect(() => {
        setState(defaultState)
    }, [
        options.type === 'PROFILE' && options.userKey
    ])

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

        state.posts.forEach((item: any) => {
            const r = postRefs.current[item.key];
            r.__item = item; // Store the item in the ref for later use
            if (r && !item.data.hasView) {
                observer.observe(r)
            };
        });

        return () => {
            observer.disconnect();
        };
    }, [state.posts, api]);

    const loadMorePosts = useCallback(async () => {
        if (state.loading || state.upToDate) return;
        setState(prev => ({ ...prev, loading: true }))
        const lastPost = state.posts[state.posts.length - 1];
        const news = await fetchPosts(api, options, lastPost?.key, FETCH_POSTS_LIMIT)
        console.log('Loaded from infinite loading', news)
        if (news.data.length == 0) {
            setState(prev => ({ ...prev, upToDate: true, loading: false }));
            return;
        }
        if (lastPost) {
            if (news.data.length == 1) {
                setState(prev => ({ ...prev, upToDate: true, loading: false }));
                return;
            }
            setState(prev => ({
                ...prev,
                posts: [...prev.posts, ...news.data.filter((post: any) => post.key !== lastPost.key)],
                upToDate: news.data.length < FETCH_POSTS_LIMIT ? true : prev.upToDate
            }));
        } else {
            setState(prev => ({ ...prev, posts: [...prev.posts, ...news.data] }));
        }
        if (firstFetchRef.current === false) {
            firstFetchRef.current = true;
            console.log('First fetch completed, setting up to date')
            setState(prev => ({ ...prev, loading: false }))
        } else {
            console.log('Subsequent fetch completed, setting loading to false')
            setTimeout(() => { setState(prev => ({ ...prev, loading: false })) }, 500)
        }
    }, [state.posts, state.loading, state.upToDate, api])

    useEffect(() => {
        if (!isPageVisible) {
            console.log('Page is not visible, skipping timeline update')
            return;
        }
        const updateTimeline = async () => {
            console.log('Updating timeline')
            // if (!firstFetchRef.current) {
            //     return;
            // }
            const firstPost = state.posts[0];
            const news = await fetchPosts(api, options, firstPost?.key, FETCH_POSTS_LIMIT, false)
            const newsData = news.data.reverse();
            console.log('Updating timeline', news)
            if (firstPost) {
                setState(prev => ({
                    ...prev,
                    posts: [...newsData.filter((post: any) => post.key !== firstPost.key), ...prev.posts]
                }));
            } else {
                setState(prev => ({ ...prev, posts: [...newsData, ...prev.posts] }));
            }
        }
        const newsInterval = setInterval(updateTimeline, 2000)
        return () => {
            clearInterval(newsInterval)
        }
    }, [api, state.posts, isPageVisible, options])

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
        setState(prev => ({
            ...prev,
            loadingLikes: { ...prev.loadingLikes, [postId]: true }
        }));
        await api.like(postId)
        setState(prev => ({
            ...prev,
            posts: prev.posts.map((post) => {
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
            })
        }));
        setState(prev => ({
            ...prev,
            loadingLikes: { ...prev.loadingLikes, [postId]: false }
        }));
    }, [api])

    console.log(state.posts)
    return {
        posts: state.posts,
        loading: state.loading,
        upToDate: state.upToDate,
        loaderRef,
        loadMorePosts,
        setRef,
        handleLike,
        loadingLikes: state.loadingLikes
    }
}