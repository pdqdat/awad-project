import { Movie } from "@/types";
import MovieCard from "@comp/movie-card";

const MoviesRow = ({ movies }: { movies: Movie[] }) => {
    return (
        <div className="my-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
            ))}
        </div>
    );
};

export default MoviesRow;
