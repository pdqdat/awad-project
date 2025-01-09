"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { fetchFavorite, removeFromFavorite } from "@lib/actions";
import MoviesList1 from "@comp/movies-list-1";
import { MovieInList } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import Section from "@comp/section";
import { Skeleton } from "@ui/skeleton";
import MoviesRowSimple from "@comp/movies-row-simple";

const FavoriteDisplay = ({ display }: { display: "row" | "list" }) => {
    // State to keep track of favorite list
    const [favoriteList, setFavoriteList] = useState<MovieInList[]>([]);
    // State to keep track of loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const fetchedFavorites = await fetchFavorite();
            if (!fetchedFavorites) {
                setLoading(false);
                toast.error("Error fetching your favorites");
                return <Section>Error fetching your favorites</Section>;
            }

            setFavoriteList(fetchedFavorites);
            setLoading(false);
        };

        fetchData();
    }, []);

    const remove = async (id: number) => {
        setLoading(true);
        const loadingToastID = toast.loading("Please wait...");

        const response = await removeFromFavorite(id);
        if (response?.status === 200) {
            setFavoriteList((prev) => prev.filter((movie) => movie.id !== id));
            toast.dismiss(loadingToastID);
            toast.success("Movie removed from favorites");
        } else {
            toast.dismiss(loadingToastID);
            toast.error("Failed to remove movie from favorites", {
                description: "Please try again later",
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
                {favoriteList.length === 0 && !loading && (
                    <div>Your favorites is empty</div>
                )}
                {favoriteList.length !== 0 && (
                    <MoviesRowSimple movies={favoriteList.slice(0, 5)} />
                )}
            </Section>
        );
    }

    if (display === "list") {
        return (
            <Section
                heading={`Favorites${favoriteList.length !== 0 ? ` (${favoriteList.length})` : ""}`}
                sectionClassName="min-h-96"
            >
                <blockquote className="my-4 border-l-2 pl-4 italic lg:hidden">
                    Favorites is the place to track the titles you love.
                </blockquote>
                <div className="gap-4 lg:grid lg:grid-cols-12">
                    <div className="mb-4 lg:col-span-9">
                        {loading &&
                            Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="mb-2 h-52 w-full"
                                />
                            ))}
                        {favoriteList.length === 0 && !loading && (
                            <div>Your favorites is empty</div>
                        )}
                        {favoriteList.length !== 0 && (
                            <MoviesList1
                                movies={favoriteList}
                                onRemove={remove}
                            />
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
                                {favoriteList.length === 0 &&
                                    !loading &&
                                    "is empty"}
                                {favoriteList.length !== 0 &&
                                    !loading &&
                                    `contains ${favoriteList.length} title${
                                        favoriteList.length > 1 ? "s" : ""
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
