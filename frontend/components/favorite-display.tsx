"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";

import { fetchFavorite, removeFromFavorite } from "@lib/actions";
import MoviesList1 from "@comp/movies-list-1";
import { MovieInList } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import Section from "@comp/section";
import { Skeleton } from "@ui/skeleton";
import MoviesRowSimple from "@comp/movies-row-simple";
import { useToast } from "@hooks/use-toast";

const FavoriteDisplay = ({ display }: { display: "row" | "list" }) => {
    // State to keep track of watchlist
    const [favorites, setWatchlist] = useState<MovieInList[]>([]);
    // State to keep track of loading state
    const [loading, setLoading] = useState(true);

    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const favorites = await fetchFavorite();
            if (!favorites) {
                setLoading(false);
                return <Section>Error fetching your favorites</Section>;
            }

            setWatchlist(favorites);
            setLoading(false);
        };

        fetchData();
    }, []);

    const remove = async (id: number) => {
        setLoading(true);

        const response = await removeFromFavorite(id);
        if (response?.status === 200) {
            setWatchlist((prev) => prev.filter((movie) => movie.id !== id));
            toast({
                title: "Movie removed from favorites",
            });
        }

        setLoading(false);
    };

    if (display === "row") {
        return (
            <Section
                id="favorites"
                heading="Favorites"
                href="/profile/favorites"
                sectionClassName="min-h-96"
            >
                {loading && (
                    <div className="my-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton key={index} className="h-96 w-full" />
                        ))}
                    </div>
                )}
                {favorites.length === 0 && !loading && (
                    <div>Your favorites is empty</div>
                )}
                {favorites.length !== 0 && (
                    <MoviesRowSimple movies={favorites.slice(0, 5)} />
                )}
            </Section>
        );
    }

    if (display === "list") {
        return (
            <Section
                heading={`Favorites${favorites.length !== 0 ? ` (${favorites.length})` : ""}`}
                sectionClassName="min-h-96"
            >
                <div className="mb-4 flex items-center lg:hidden">
                    <Info className="mr-1 size-5" />
                    Favorites is the place to track the titles you love.
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
                        {favorites.length === 0 && !loading && (
                            <div>Your favorites is empty</div>
                        )}
                        {favorites.length !== 0 && (
                            <MoviesList1 movies={favorites} onRemove={remove} />
                        )}
                    </div>
                    <div className="hidden lg:col-span-3 lg:mb-0 lg:block">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                Favorites is the place to track the titles
                                    you love.
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                Your Favorites {loading && "is loading..."}
                                {favorites.length === 0 &&
                                    !loading &&
                                    "is empty"}
                                {favorites.length !== 0 &&
                                    !loading &&
                                    `contains ${favorites.length} title${
                                        favorites.length > 1 ? "s" : ""
                                    }`}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Section>
        );
    }
};

export default FavoriteDisplay;
