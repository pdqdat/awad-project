"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import Section from "@comp/section";
import { Avatar, AvatarImage, AvatarFallback } from "@ui/avatar";
import { Skeleton } from "@ui/skeleton";
import { Button } from "@ui/button";
import { MovieInList } from "@/types";
import { fetchFavorite, fetchRatingList, fetchWatchlist } from "@lib/actions";

const ProfileSection = () => {
    // State to keep track of watchlist
    const [watchlist, setWatchlist] = useState<MovieInList[] | null>([]);
    const [favoriteList, setFavoriteList] = useState<MovieInList[] | null>([]);
    const [ratingList, setRatingList] = useState<MovieInList[] | null>([]);

    // State to keep track of loading state
    const [loading, setLoading] = useState(true);

    const { isLoaded, user } = useUser();
    const { openUserProfile } = useClerk();

    const joinDate = user?.createdAt;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const fetchedWatchlist = await fetchWatchlist();
            if (!fetchedWatchlist) {
                setLoading(false);
                console.log("Error fetching your watchlist");
                setWatchlist(null);
            }
            setWatchlist(fetchedWatchlist);

            const fetchedFavorites = await fetchFavorite();
            if (!fetchedFavorites) {
                setLoading(false);
                console.log("Error fetching your favorites");
                setFavoriteList(null);
            }
            setFavoriteList(fetchedFavorites);

            const fetchedRatingList = await fetchRatingList();
            if (!fetchedRatingList) {
                setLoading(false);
                console.log("Error fetching your ratings");
                setRatingList(null);
            }
            setRatingList(fetchedRatingList);

            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <Section
            sectionClassName="bg-secondary-foreground text-background"
            containerClassName="flex flex-col md:flex-row items-center gap-4"
        >
            <div className="flex items-center gap-4">
                {isLoaded ? (
                    <Avatar className="size-28 lg:size-36">
                        <AvatarImage
                            src={user?.imageUrl}
                            alt={user?.fullName || "User avatar"}
                            className="object-cover"
                        />
                        <AvatarFallback className="text-sm">
                            {user?.fullName}
                        </AvatarFallback>
                    </Avatar>
                ) : (
                    <Skeleton className="size-28 rounded-full lg:size-36" />
                )}
                {isLoaded ? (
                    <div className="flex flex-col">
                        <div className="h2">{user?.fullName || "User"}</div>
                        <div className="text-muted-foreground">
                            Member since{" "}
                            {joinDate
                                ? new Date(joinDate).toLocaleDateString(
                                      "en-GB",
                                      {
                                          year: "numeric",
                                          month: "2-digit",
                                          day: "2-digit",
                                      },
                                  )
                                : "Unknown"}
                        </div>
                        <Button
                            className="mt-4"
                            variant="secondary"
                            onClick={() => openUserProfile()}
                        >
                            Edit profile
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 md:ml-auto md:gap-6 lg:grid-cols-4">
                {/* Ratings */}
                {loading ? (
                    <Skeleton className="size-20"></Skeleton>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg bg-foreground p-4 text-center">
                        <div className="text-sm font-medium text-muted-foreground">
                            Ratings
                        </div>
                        <div className="text-xl font-bold">
                            {loading ? "-" : ratingList?.length || 0}
                        </div>
                    </div>
                )}

                {/* Watchlist */}
                {loading ? (
                    <Skeleton className="size-20"></Skeleton>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg bg-foreground p-4 text-center">
                        <div className="text-sm font-medium text-muted-foreground">
                            Watchlist
                        </div>
                        <div className="text-xl font-bold">
                            {loading ? "-" : watchlist?.length || 0}
                        </div>
                    </div>
                )}

                {/* Favorites */}
                {loading ? (
                    <Skeleton className="size-20"></Skeleton>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg bg-foreground p-4 text-center">
                        <div className="text-sm font-medium text-muted-foreground">
                            Favorites
                        </div>
                        <div className="text-xl font-bold">
                            {loading ? "-" : favoriteList?.length || 0}
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
};

export default ProfileSection;
