import { useCallback, useEffect, useRef, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { useInput } from "../../../hooks/use-input";
import { useOnClickOutside } from "usehooks-ts";


const SEARCH_LIMIT = 50;
export const useProfileSearcher = () => {
    const { api } = useApi();
    const searchInput = useInput('');
    const [profilesState, setProfilesState] = useState({ profiles: [] as any[], loading: false, showResults: true });
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<any | null>(null);

    useEffect(() => {
        if (searchInput.value.trim() === '') {
            setProfilesState((prev) => ({ ...prev, profiles: [], loading: false }));
            return;
        }
        setProfilesState((prev) => ({ ...prev, loading: true }));
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(async () => {
            const profiles = await api.activeUsers(SEARCH_LIMIT, searchInput.value.toLowerCase());;
            console.log('Fetched profiles:', profiles);
            setProfilesState((prev) => ({ ...prev, profiles: profiles.data, loading: false }));
        }, 200);
    }, [searchInput.value, api]);


    const onContainerIn = useCallback(() => {
        if (!profilesState.showResults) {

            setProfilesState((prev) => ({ ...prev, showResults: true }));
        }

    }, [setProfilesState, profilesState]);


    const onContainerOut = useCallback(() => {
        if (profilesState.showResults) {

            setProfilesState((prev) => ({ ...prev, showResults: false }));
        }

    }, [setProfilesState, profilesState]);

    useOnClickOutside(containerRef, onContainerOut)

    const onFollow = useCallback(async (userId: string) => {
        await api.follow(userId);
        setProfilesState((prev) => ({
            ...prev,
            profiles: prev.profiles ? prev.profiles.map(profile => profile.userId === userId ? { ...profile, isFollowing: true } : profile) : []
        }));
        console.log('Followed user:', userId);
    }, [api]);


    const resetSearcher = useCallback(async () => {
        searchInput.reset();
        setProfilesState({ profiles: [], loading: false, showResults: false });
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    }, [searchInput, setProfilesState]);

    return {
        profiles: profilesState.profiles,
        loading: profilesState.loading,
        showResults: profilesState.showResults,
        onFollow: onFollow,
        containerRef,
        onContainerIn,
        onContainerOut,
        resetSearcher,
        ...searchInput,

    }
}