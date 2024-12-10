import { Movie } from "@/types";
import MovieCard from "@comp/movie-card";

interface MoviesRowProps {
    movies: Movie[];
}

const MoviesRow = ({ movies }: MoviesRowProps) => {
    return (
        <div className="flex space-x-2 my-4">
            {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id}/>
            ))}
        </div>
    );
};

export default MoviesRow;
