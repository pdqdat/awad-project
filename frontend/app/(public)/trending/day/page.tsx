import type { Metadata } from "next";

import MoviesGrid from "@comp/movies-grid";
import { fetchTrendingMovies } from "@lib/actions";
import PaginationControls from "@comp/pagination-controls";
import PageHeading from "@comp/page-heading";

export const metadata: Metadata = {
    title: "Today's trending",
};

const DailyTrendingPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const { page } = await searchParams;

    const { data: movies, totalPages } = await fetchTrendingMovies(
        "day",
        page ? parseInt(page as string) : 1,
    );

    return (
        <div className="py-8">
            {movies ? (
                <div className="container">
                    <PageHeading>Today&apos;s trending</PageHeading>
                    <MoviesGrid movies={movies} />
                    <PaginationControls
                        totalPages={totalPages}
                        className="mt-8"
                    />
                </div>
            ) : (
                <p>Error fetching today&apos;s trending movies</p>
            )}
        </div>
    );
};

export default DailyTrendingPage;
