"use client";

import { useEffect, useState, useCallback } from "react";
import { LoaderCircle, Plus, Bookmark, Check } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import {
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
} from "@lib/actions";
import { useToast } from "@hooks/use-toast";

const WatchlistBtn = ({
    movieID,
    small = false,
    className,
}: {
    movieID: number;
    small?: boolean;
    className?: string;
}) => {
    // State to keep track of loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // State to keep track of whether the movie is in the watchlist
    const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);

    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const checkIsInWatchlist = useCallback(async () => {
        setIsLoading(true);

        // Fetch watchlist
        const watchlist = await fetchWatchlist();
        if (!watchlist) return;

        // Check if movie ID is in watchlist
        setIsInWatchlist(watchlist.some((movie) => movie.id === movieID));

        setIsLoading(false);
    }, [movieID, setIsLoading, setIsInWatchlist]);

    useEffect(() => {
        // If user is signed in, check if movie is in watchlist
        // when the component is mounted
        if (isLoaded && isSignedIn) {
            checkIsInWatchlist();
        }
        // If user is not signed in, do nothing
    }, [isLoaded, isSignedIn, checkIsInWatchlist]);

    const handleClick = useCallback(async () => {
        // If user is not signed in, redirect to sign in page and notify user
        if (!isSignedIn || !isLoaded) {
            toast({
                title: "Sign in to add to your Watchlist",
            });
            router.push(
                `/sign-in?redirect_url=${encodeURIComponent(window.location.toString())}`,
            );
            return;
        }

        setIsLoading(true);

        if (isInWatchlist) {
            // If movie is in watchlist, remove it from watchlist
            const response = await removeFromWatchlist(movieID);

            if (response?.status === 200) {
                setIsInWatchlist(false);
                toast({
                    title: `Movie #${movieID} removed from watchlist`,
                });
            }
        } else {
            // If movie is not in watchlist, add it to watchlist
            const response = await addToWatchlist(movieID);

            if (response?.status === 201) {
                setIsInWatchlist(true);
                toast({
                    title: `Movie #${movieID} added to watchlist`,
                });
            }
        }

        setIsLoading(false);
    }, [
        isSignedIn,
        isLoaded,
        toast,
        router,
        setIsLoading,
        isInWatchlist,
        setIsInWatchlist,
        movieID,
    ]);

    const btnContent = isInWatchlist ? (
        <>
            <Check />
            In Watchlist
        </>
    ) : (
        <>
            <Plus />
            Add to Watchlist
        </>
    );

    if (small) {
        return (
            <Bookmark
                className={cn(
                    "relative size-8 cursor-pointer stroke-primary stroke-[1.5px] hover:scale-110",
                    isLoading && "animate-pulse",
                    isInWatchlist && "fill-primary",
                    className,
                )}
                onClick={handleClick}
            />
        );
    }

    return (
        <Button
            disabled={isLoading}
            onClick={handleClick}
            className={cn("", className)}
        >
            {isLoading ? <LoaderCircle className="animate-spin" /> : btnContent}
        </Button>
    );
};

export default WatchlistBtn;
