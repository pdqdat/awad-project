import type { Metadata } from "next";

import MoviesGrid from "@comp/movies-grid";
import { fetchPopularMovies } from "@lib/actions";
import MainFilter from "@comp/main-filter";
import MobileFilter from "@comp/mobile-filter";
import PaginationControls from "@comp/pagination-controls";
import PageHeading from "@comp/page-heading";

export const metadata: Metadata = {
    title: "Popular Movies",
};

const PopularPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const { page, genre, minRating, maxRating, from, to } = await searchParams;

    const pageParam = page ? parseInt(page as string) : 1;

    const { data: movies, totalPages } = await fetchPopularMovies(
        pageParam,
        genre as string | string[],
        Array.isArray(minRating) ? minRating[0] : minRating,
        Array.isArray(maxRating) ? maxRating[0] : maxRating,
        from as string,
        to as string,
    );

    return (
        <div className="min-h-72 py-8 lg:min-h-[30rem]">
            <div className="container">
                <PageHeading>Popular Movies</PageHeading>
                {movies ? (
                    <div className="gap-4 lg:grid lg:grid-cols-12">
                        <div className="col-span-4 mb-4 lg:mb-0 xl:col-span-3">
                            <MainFilter />
                            <MobileFilter />
                        </div>
                        <div className="col-span-8 xl:col-span-9">
                            <MoviesGrid movies={movies} />
                            <PaginationControls
                                totalPages={totalPages}
                                className="mt-8"
                            />
                        </div>
                    </div>
                ) : (
                    <p>Error fetching popular movies</p>
                )}
            </div>
        </div>
    );
};

export default PopularPage;
