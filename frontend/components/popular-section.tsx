import MoviesRow from "@comp/movies-row";
import { fetchPopularMovies } from "@lib/actions";

const PopularSection = async () => {

    const { data: movies, } = await fetchPopularMovies(
        1,
        "", // genre
        "0",  // minRating
        "10", // maxRating
        "", // from
        ""  // to
    );

    return (
        <div className="bg-muted py-8">
            <div className="container">
                <h3 className="h3 mb-4 font-semibold text-primary">
                    Popular Movies
                </h3>

                {movies ? (
                    <MoviesRow movies={movies.slice(0, 10)} />
                ) : (
                    <p>Error fetching popular movies</p>
                )}
            </div>
        </div>
    );
};

export default PopularSection;
