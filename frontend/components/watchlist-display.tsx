"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";

import { fetchWatchlist, removeFromWatchlist } from "@lib/actions";
import MoviesList1 from "@comp/movies-list-1";
import { MovieInList } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import Section from "@comp/section";
import { Skeleton } from "@ui/skeleton";
import MoviesRowSimple from "@comp/movies-row-simple";
import { useToast } from "@hooks/use-toast";

const WatchlistDisplay = ({ display }: { display: "row" | "list" }) => {
    // State to keep track of watchlist
    const [watchlist, setWatchlist] = useState<MovieInList[]>([]);
    // State to keep track of loading state
    const [loading, setLoading] = useState(true);

    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const watchlist = await fetchWatchlist();
            if (!watchlist) {
                setLoading(false);
                return <Section>Error fetching your watchlist</Section>;
            }

            setWatchlist(watchlist);
            setLoading(false);
        };

        fetchData();
    }, []);

    const remove = async (id: number) => {
        setLoading(true);

        const response = await removeFromWatchlist(id);
        if (response?.status === 200) {
            setWatchlist((prev) => prev.filter((movie) => movie.id !== id));
            toast({
                title: "Movie removed from watchlist",
            });
        }

        setLoading(false);
    };

    if (display === "row") {
        return (
            <Section
                id="watchlist"
                heading="Watchlist"
                href="/profile/watchlist"
                sectionClassName="min-h-96"
            >
                {loading && (
                    <div className="my-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton key={index} className="h-96 w-full" />
                        ))}
                    </div>
                )}
                {watchlist.length === 0 && !loading && (
                    <div>Your watchlist is empty</div>
                )}
                {watchlist.length !== 0 && (
                    <MoviesRowSimple movies={watchlist.slice(0, 5)} />
                )}
            </Section>
        );
    }

    if (display === "list") {
        return (
            <Section
                heading={`Watchlist${watchlist.length !== 0 ? ` (${watchlist.length})` : ""}`}
                sectionClassName="min-h-96"
            >
                <div className="mb-4 flex items-center lg:hidden">
                    <Info className="mr-1 size-5" />
                    Watchlist is the place to track the titles you want to
                    watch.
                </div>
                <div className="gap-4 lg:grid lg:grid-cols-12">
                    <div className="mb-4 lg:col-span-9">
                        {loading &&
                            Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="mb-2 h-52 w-full"
                                />
                            ))}
                        {watchlist.length === 0 && !loading && (
                            <div>Your watchlist is empty</div>
                        )}
                        {watchlist.length !== 0 && (
                            <MoviesList1 movies={watchlist} onRemove={remove} />
                        )}
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
                                Your Watchlist {loading && "is loading..."}
                                {watchlist.length === 0 &&
                                    !loading &&
                                    "is empty"}
                                {watchlist.length !== 0 &&
                                    !loading &&
                                    `contains ${watchlist.length} title${
                                        watchlist.length > 1 ? "s" : ""
                                    }`}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Section>
        );
    }
};

export default WatchlistDisplay;
