import type { Metadata } from "next";

import MoviesGrid from "@comp/movies-grid";
import { fetchTrendingMovies } from "@lib/actions";

export const metadata: Metadata = {
    title: "Trending Movies",
};

const TrendingPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const { page, time } = await searchParams;

    const { results: movies } = await fetchTrendingMovies(
        "week",
        1,
    );

    return (
        <div>
            {movies ? (
                <div className="container">
                    {page && <div>Page param: {page}</div>}
                    {time && <div>Time param: {time}</div>}
                    <MoviesGrid movies={movies} />
                </div>
            ) : (
                <p>Error fetching trending movies</p>
            )}
        </div>
    );
};

export default TrendingPage;
