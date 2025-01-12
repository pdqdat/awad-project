"use client";

import { useEffect, useState, useCallback } from "react";
import { LoaderCircle, Star } from "lucide-react";
import { cn } from "@lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";

import { Button } from "@ui/button";
import { rateMovie, removeRating, fetchRatingList } from "@lib/actions";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";

const RateBtn = ({
    movieID,
    small = false,
    className,
    disabled = false,
}: {
    movieID: number;
    small?: boolean;
    className?: string;
    disabled?: boolean;
}) => {
    // State to keep track of loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // State to keep track of rated value when user has rated the movie
    const [ratedValue, setRatedValue] = useState<number | null>(null);
    // State to keep track of rating value when user rates the movie
    const [rating, setRating] = useState<number | null>(null);

    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    const checkIsRated = useCallback(async () => {
        setIsLoading(true);

        // Fetch rating list
        const ratingList = await fetchRatingList();
        if (!ratingList) return;

        // Find the movie in the rating list
        const ratedMovie = ratingList.find((movie) => movie.id === movieID);

        // If movie is rated, update button content to show user rating
        if (ratedMovie) {
            setRatedValue(ratedMovie.userRating);
            setRating(ratedMovie.userRating);
        }

        setIsLoading(false);
    }, [movieID, setIsLoading, setRatedValue, setRating]);

    useEffect(() => {
        // If user is signed in, check if movie is rated
        // when the component is mounted
        if (isLoaded && isSignedIn) {
            checkIsRated();
        }
        // If user is not signed in, do nothing
    }, [isLoaded, isSignedIn, checkIsRated]);

    const handleClick = useCallback(async () => {
        // If user is not signed in, redirect to sign in page and notify user
        if (!isSignedIn || !isLoaded) {
            toast.info("Sign in to rate this movie");
            router.push(
                `/sign-in?redirect_url=${encodeURIComponent(window.location.toString())}`,
            );
            return;
        }

        setIsLoading(true);
        const loadingToastID = toast.loading("Please wait...");

        if (rating === null) {
            toast.dismiss(loadingToastID);
            toast.error("Please select a rating");
            return;
        }

        // If user has rated the movie and clicks the same rating, REMOVE THE RATING
        if (ratedValue && rating === ratedValue) {
            const response = await removeRating(movieID);

            if (response?.status === 200) {
                setRatedValue(null);
                setRating(null);
                toast.dismiss(loadingToastID);
                toast.success("Rating removed");
            } else {
                toast.dismiss(loadingToastID);
                toast.error("Rating removal failed", {
                    description: "Please try again later",
                });
            }

            setIsLoading(false);
            return;
        }

        // If user has rated the movie and clicks a different rating, UPDATE THE RATING
        if (ratedValue && rating !== ratedValue) {
            const response = await rateMovie(movieID, rating);

            if (response?.status === 200) {
                setRatedValue(rating);
                toast.dismiss(loadingToastID);
                toast.success("Rating updated", {
                    action: {
                        label: "View your Ratings",
                        onClick: () => {
                            router.push(`/profile/ratings`);
                        },
                    },
                });
            } else {
                toast.dismiss(loadingToastID);
                toast.error("Rating update failed", {
                    description: "Please try again later",
                });
            }

            setIsLoading(false);
            return;
        }

        // If user has not rated the movie, RATE THE MOVIE
        if (!ratedValue) {
            const response = await rateMovie(movieID, rating);

            if (response?.status === 200) {
                setRatedValue(rating);
                toast.dismiss(loadingToastID);
                toast.success("Movie rated", {
                    action: {
                        label: "View your Ratings",
                        onClick: () => {
                            router.push(`/profile/ratings`);
                        },
                    },
                });
            } else {
                toast.dismiss(loadingToastID);
                toast.error("Rating failed", {
                    description: "Please try again later",
                });
            }

            setIsLoading(false);
        }
    }, [
        setIsLoading,
        router,
        isSignedIn,
        isLoaded,
        ratedValue,
        rating,
        movieID,
    ]);

    const btnContent = (
        <>
            <Star className={ratedValue ? "fill-primary stroke-primary" : ""} />
            <span className={ratedValue ? "text-primary" : ""}>
                {ratedValue ? ratedValue : "Rate"}
            </span>
        </>
    );

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    size={small ? "sm" : "default"}
                    className={cn(small && "text-sm", className)}
                    disabled={isLoading || disabled}
                >
                    {isLoading ? (
                        <LoaderCircle
                            className={cn(small && "size-4", "animate-spin")}
                        />
                    ) : (
                        btnContent
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <div className="flex flex-col gap-2 p-2">
                    <div className="flex items-center gap-2">
                        <span>Rate this movie: </span>
                        <span className="font-medium text-primary">
                            {rating ? rating : "?"}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-0.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <Button
                                key={i}
                                variant={rating === i ? "default" : "outline"}
                                size="sm"
                                onClick={() => setRating(i)}
                            >
                                {i}
                            </Button>
                        ))}
                    </div>
                    <Button
                        className="mt-2 w-full"
                        // Disable button if user has not selected a rating
                        // or if user has rated the movie
                        disabled={!rating || ratedValue === rating}
                        onClick={handleClick}
                    >
                        {isLoading ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            "Rate"
                        )}
                    </Button>
                    {ratedValue && ratedValue === rating && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleClick}
                        >
                            {isLoading ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                "Remove rating"
                            )}
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default RateBtn;
