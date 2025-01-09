"use client";

import { useEffect, useState, useCallback } from "react";
import { LoaderCircle, Heart } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import {
    fetchFavorite,
    addToFavorite,
    removeFromFavorite,
} from "@lib/actions";
import { useToast } from "@hooks/use-toast";

const FavBtn = ({
    movieID,
    className,
}: {
    movieID: number;
    className?: string;
}) => {
    // State to keep track of loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // State to keep track of whether the movie is in the favorites
    const [isInFav, setIsInFav] = useState<boolean>(false);

    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const checkIsInFav = useCallback(async () => {
        setIsLoading(true);

        // Fetch favorites
        const favorites = await fetchFavorite();
        if (!favorites) return;

        // Check if movie ID is in watchlist
        setIsInFav(favorites.some((movie) => movie.id === movieID));

        setIsLoading(false);
    }, [movieID, setIsLoading, setIsInFav]);

    useEffect(() => {
        // If user is signed in, check if movie is in favorites
        // when the component is mounted
        if (isLoaded && isSignedIn) {
            checkIsInFav();
        }
        // If user is not signed in, do nothing
    }, [isLoaded, isSignedIn, checkIsInFav]);

    const handleClick = useCallback(async () => {
        // If user is not signed in, redirect to sign in page and notify user
        if (!isSignedIn || !isLoaded) {
            toast({
                title: "Sign in to add to your Favorites",
            });
            router.push(
                `/sign-in?redirect_url=${encodeURIComponent(window.location.toString())}`,
            );
            return;
        }

        setIsLoading(true);

        if (isInFav) {
            // If movie is in favorites, remove it
            const response = await removeFromFavorite(movieID);

            if (response?.status === 200) {
                setIsInFav(false);
                toast({
                    title: "Movie removed from favorites",
                });
            }
        } else {
            // If movie is not in favorites, add it
            const response = await addToFavorite(movieID);

            if (response?.status === 201) {
                setIsInFav(true);
                toast({
                    title: "Movie added to favorites",
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
        isInFav,
        setIsInFav,
        movieID,
    ]);

    const btnContent = isInFav ? (
        <Heart className="fill-primary stroke-primary" />
    ) : (
        <Heart />
    );

    return (
        <Button
            variant="secondary"
            size="icon"
            disabled={isLoading}
            onClick={handleClick}
            className={cn("size-10", className)}
        >
            {isLoading ? <LoaderCircle className="animate-spin" /> : btnContent}
        </Button>
    );
};

export default FavBtn;
