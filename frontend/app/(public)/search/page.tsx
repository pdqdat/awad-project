import type { Metadata } from "next";
import { format } from "date-fns";

import { searchMovies } from "@lib/actions";
import siteConfig from "@/config/site";
import MoviesList from "@comp/movies-list";
import PaginationControls from "@comp/pagination-controls-client";
import MobileFilter from "@comp/mobile-filter";
import MainFilter from "@comp/main-filter";

export const metadata: Metadata = {
    title: "Search",
};

const SearchPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const { q, page, genre, minRating, maxRating, from, to } =
        await searchParams;
    if (!q) {
        return (
            <div className="min-h-72 py-8 lg:min-h-[30rem]">
                <div className="container">
                    <h1 className="h3">Search {siteConfig.name}</h1>
                    <p>Type a word or phrase in the search box</p>
                </div>
            </div>
        );
    }
    const pageParam = page ? parseInt(page as string) : 1;

    const response = await searchMovies(q as string, false, pageParam);
    const { results: movies, totalPages } = response;

    return (
        <div className="min-h-72 py-8 lg:min-h-[30rem]">
            <div className="container">
                <h1 className="h3 mb-8">Search results for &quot;{q}&quot;</h1>
                {movies ? (
                    <div className="gap-4 lg:grid lg:grid-cols-12">
                        <div className="col-span-12">
                            {genre ? (
                                <div>
                                    Genre(s):{" "}
                                    {Array.isArray(genre) ? (
                                        genre.map((g, index) => (
                                            <span key={index} className="mr-2">
                                                {g}
                                            </span>
                                        ))
                                    ) : (
                                        <span>{genre}</span>
                                    )}
                                </div>
                            ) : null}
                            {minRating && <div>Min rating: {minRating}</div>}
                            {maxRating && <div>Max rating: {maxRating}</div>}
                            {from && (
                                <div>
                                    From:{" "}
                                    {format(new Date(from as string), "PPP")}
                                </div>
                            )}
                            {to && (
                                <div>
                                    To: {format(new Date(to as string), "PPP")}
                                </div>
                            )}
                        </div>
                        <div className="col-span-4 mb-4 lg:mb-0 xl:col-span-3">
                            <MainFilter />
                            <MobileFilter />
                        </div>
                        <div className="col-span-8 xl:col-span-9">
                            <MoviesList movies={movies} />
                            <PaginationControls
                                totalPages={totalPages}
                                className="mt-8"
                            />
                        </div>
                    </div>
                ) : (
                    <p>Error fetching movies</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
