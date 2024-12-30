import type { Metadata } from "next";

import MoviesGrid from "@comp/movies-grid";
import { fetchPopularMovies } from "@lib/actions";

export const metadata: Metadata = {
    title: "Popular Movies",
};

const PopularPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const { page } = await searchParams;

    const { data: movies } = await fetchPopularMovies(page ? parseInt(page as string) : 1);

    return (
        <div className="py-8">
            {movies ? (
                <div className="container">
                    {page && <div>Page param: {page}</div>}
                    <MoviesGrid movies={movies} />
                </div>
            ) : (
                <p>Error fetching popular movies</p>
            )}
        </div>
    );
};

export default PopularPage;