import { Movie } from "@/types";
import MovieCard from "@comp/movie-card";

const MoviesGrid = ({ movies }: { movies: Movie[] }) => {
    return (
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
            ))}
        </div>
    );
};

export default MoviesGrid;
