"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import Section from "@comp/section";
import { Avatar, AvatarImage, AvatarFallback } from "@ui/avatar";
import { Skeleton } from "@ui/skeleton";
import { Button } from "@ui/button";
import { MovieInList } from "@/types";
import { fetchWatchlist } from "@lib/actions";

const ProfileSection = () => {
    // State to keep track of watchlist
    const [watchlist, setWatchlist] = useState<MovieInList[] | null>([]);
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

            // const favoriteList=await fetch...
            // if (!fetchedWatchlist)
            // setFavoriteList...

            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <Section
            sectionClassName="bg-secondary-foreground text-background"
            containerClassName="flex items-center gap-4"
        >
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
                    <div className="h2">{user?.fullName}</div>
                    <div>
                        Member since{" "}
                        {joinDate
                            ? new Date(joinDate).toLocaleDateString("en-GB", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                              })
                            : "Unknown"}
                    </div>
                    <Button
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
            {loading ? (
                <Skeleton className="size-20"></Skeleton>
            ) : (
                <div className="flex size-20 flex-col items-center justify-center rounded-lg bg-foreground p-2">
                    <div>Watchlist</div>
                    <div>{watchlist && watchlist?.length}</div>
                </div>
            )}
        </Section>
    );
};

export default ProfileSection;
