import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { Info } from "lucide-react";

import Section from "@comp/section";
import { fetchWatchlist } from "@lib/actions";
import MoviesListInList from "@comp/movies-list-in-list";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";

export const generateMetadata = async (): Promise<Metadata> => {
    const user = await currentUser();

    if (!user) {
        return {
            title: "Watchlist",
        };
    }

    return {
        title: `${user.fullName}'s Watchlist`,
    };
};

const WatchlistPage = async () => {
    const user = await currentUser();

    if (!user) {
        return <Section>Failed to fetch user info</Section>;
    }

    const watchlist = await fetchWatchlist();
    if (!watchlist) {
        return <Section>Error fetching your watchlist</Section>;
    }

    return (
        <Section
            heading={`Watchlist${watchlist.length !== 0 ? ` (${watchlist.length})` : ""}`}
        >
            <div className="mb-4 flex items-center lg:hidden">
                <Info className="mr-1 size-5" />
                Watchlist is the place to track the titles you want to watch.
            </div>
            {watchlist.length !== 0 ? (
                <div className="gap-4 lg:grid lg:grid-cols-12">
                    <div className="mb-4 lg:col-span-9">
                        <MoviesListInList movies={watchlist} />
                    </div>
                    <div className="hidden lg:col-span-3 lg:mb-0 lg:block">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Watchlist is the place to track the titles
                                    you want to watch.
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                Your Watchlist{" "}
                                {watchlist.length === 0
                                    ? "is currently empty"
                                    : `contains ${watchlist.length} title${watchlist.length > 1 ? "s" : ""}`}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div>Your watchlist is empty</div>
            )}
        </Section>
    );
};

export default WatchlistPage;
