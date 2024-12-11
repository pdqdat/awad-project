import type { Metadata } from "next";

import { searchMovies } from "@lib/actions";
import siteConfig from "@/config/site";
import MoviesList from "@comp/movies-list";
import PaginationControls from "@comp/pagination-controls";

export const metadata: Metadata = {
    title: "Search",
};

const SearchPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const { q, page } = await searchParams;
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
    const { results: movies, page: currentPage, totalPages } = response;

    return (
        <div className="min-h-72 py-8 lg:min-h-[30rem]">
            <div className="container">
                <h1 className="h3 mb-8">Search results for &quot;{q}&quot;</h1>
                {movies ? (
                    <>
                        <MoviesList movies={movies} />
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            query={q}
                            className="mt-8"
                        />
                    </>
                ) : (
                    <p>Error fetching movies</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
