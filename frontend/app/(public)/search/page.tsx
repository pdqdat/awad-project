import type { Metadata } from "next";

import { searchMovies } from "@lib/actions";
import siteConfig from "@/config/site";
import MoviesList from "@comp/movies-list";
import PaginationControls from "@comp/pagination-controls";
import MobileFilter from "@comp/mobile-filter";
import MainFilter from "@comp/main-filter";
import PageHeading from "@comp/page-heading";

export const generateMetadata = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> => {
    const { q } = await searchParams;

    return {
        title: `"${q}"`,
    };
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

    const response = await searchMovies(
        q as string,
        pageParam,
        genre as string | string[],
        Array.isArray(minRating) ? minRating[0] : minRating,
        Array.isArray(maxRating) ? maxRating[0] : maxRating,
        from as string,
        to as string,
    );
    const { data: movies, totalPages, total } = response;

    return (
        <div className="min-h-72 py-8">
            <div className="container">
                <PageHeading>
                    {total} result{total <= 1 ? "" : "s"} for &quot;{q}
                    &quot;
                </PageHeading>
                {movies ? (
                    <div className="gap-4 lg:grid lg:grid-cols-12">
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
