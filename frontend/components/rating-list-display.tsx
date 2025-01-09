"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { fetchRatingList, removeRating } from "@lib/actions";
import MoviesList1 from "@comp/movies-list-1";
import { MovieInList } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import Section from "@comp/section";
import { Skeleton } from "@ui/skeleton";
import MoviesRowSimple from "@comp/movies-row-simple";

const RatingListDisplay = ({ display }: { display: "row" | "list" }) => {
    // State to keep track of watchlist
    const [ratingList, setRatingList] = useState<MovieInList[]>([]);
    // State to keep track of loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const ratingList = await fetchRatingList();
            if (!ratingList) {
                setLoading(false);
                toast.error("Error fetching your ratings");
                return <Section>Error fetching your ratings</Section>;
            }

            setRatingList(ratingList);
            setLoading(false);
        };

        fetchData();
    }, []);

    const remove = async (id: number) => {
        setLoading(true);
        const loadingToastID = toast.loading("Please wait...");

        const response = await removeRating(id);
        if (response?.status === 200) {
            setRatingList((prev) => prev.filter((movie) => movie.id !== id));
            toast.dismiss(loadingToastID);
            toast.success("Rating removed");
        } else {
            toast.dismiss(loadingToastID);
            toast.error("Failed to remove rating", {
                description: "Please try again later",
            });
        }

        setLoading(false);
    };

    if (display === "row") {
        return (
            <Section
                id="ratings"
                heading="Ratings"
                href="/profile/ratings"
                containerClassName="min-h-96"
            >
                {loading && (
                    <div className="my-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton key={index} className="h-96 w-full" />
                        ))}
                    </div>
                )}
                {ratingList.length === 0 && !loading && (
                    <div>Your ratings is empty</div>
                )}
                {ratingList.length !== 0 && (
                    <MoviesRowSimple movies={ratingList.slice(0, 5)} />
                )}
            </Section>
        );
    }

    if (display === "list") {
        return (
            <Section
                id="ratings"
                heading={`Ratings${ratingList.length !== 0 ? ` (${ratingList.length})` : ""}`}
                sectionClassName="min-h-96"
            >
                <blockquote className="my-4 border-l-2 pl-4 italic lg:hidden">
                    This page compiles a list of titles you have rated,
                    providing a convenient overview of all your ratings.
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
                        {ratingList.length === 0 && !loading && (
                            <div>Your ratings is empty</div>
                        )}
                        {ratingList.length !== 0 && (
                            <MoviesList1
                                movies={ratingList}
                                onRemove={remove}
                            />
                        )}
                    </div>
                    <div className="hidden lg:col-span-3 lg:mb-0 lg:block">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    This page compiles a list of titles you have
                                    rated, providing a convenient overview of
                                    all your ratings.
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                Your Ratings {loading && "is loading..."}
                                {ratingList.length === 0 &&
                                    !loading &&
                                    "is empty"}
                                {ratingList.length !== 0 &&
                                    !loading &&
                                    `contains ${ratingList.length} title${
                                        ratingList.length > 1 ? "s" : ""
                                    }`}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Section>
        );
    }
};

export default RatingListDisplay;
