import { Movie } from "@/types";
import MovieCard from "@comp/movie-card";

interface MoviesGridProps {
    movies: Movie[];
}

const MoviesGrid = ({ movies }: MoviesGridProps) => {
    return (
        <div className="grid grid-cols-5 gap-2">
            {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
            ))}
        </div>
    );
};

export default MoviesGrid;
