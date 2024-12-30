import type { Metadata } from "next";

import MoviesGrid from "@comp/movies-grid";
import { fetchTopRatedMovies, fetchPopularMovies } from "@lib/actions";

export const metadata: Metadata = {
    title: "Top Rated Movies",
};

const TopRatedPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const { page } = await searchParams;

    const { data: movies } = await fetchTopRatedMovies(1);

    return (
        <div className="py-8">
            {movies ? (
                <div className="container">
                    {page && <div>Page param: {page}</div>}
                    <MoviesGrid movies={movies} />
                </div>
            ) : (
                <p>Error fetching top rated movies</p>
            )}
        </div>
    );
};

export default TopRatedPage;