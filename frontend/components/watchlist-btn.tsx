"use client";

import { useEffect, useState, useCallback } from "react";
import { LoaderCircle, Plus, Bookmark, Check } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useRouter } from "nextjs-toploader/app";
import { cn } from "@lib/utils";
import { toast } from "sonner";

import { Button } from "@ui/button";
import {
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
} from "@lib/actions";

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
            toast.info("Sign in to add to your Watchlist");
            router.push(
                `/sign-in?redirect_url=${encodeURIComponent(window.location.toString())}`,
            );
            return;
        }

        setIsLoading(true);
        const loadingToastID = toast.loading("Please wait...");

        if (isInWatchlist) {
            // If movie is in watchlist, REMOVE IT FROM WATCHLIST
            const response = await removeFromWatchlist(movieID);

            if (response?.status === 200) {
                setIsInWatchlist(false);
                toast.dismiss(loadingToastID);
                toast.success("Movie removed from watchlist");
            } else {
                toast.dismiss(loadingToastID);
                toast.error("Error removing movie from watchlist", {
                    description: "Please try again later",
                });
            }
        } else {
            // If movie is not in watchlist, ADD IT TO WATCHLIST
            const response = await addToWatchlist(movieID);

            if (response?.status === 201) {
                setIsInWatchlist(true);
                toast.dismiss(loadingToastID);
                toast.success("Movie added to watchlist", {
                    action: {
                        label: "View your Watchlist",
                        onClick: () => {
                            router.push(`/profile/watchlist`);
                        },
                    },
                });
            } else {
                toast.dismiss(loadingToastID);
                toast.error("Error adding movie to watchlist", {
                    description: "Please try again later",
                });
            }
        }

        setIsLoading(false);
    }, [
        isSignedIn,
        isLoaded,
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
