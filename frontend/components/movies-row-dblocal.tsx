import { CastDetail } from "@/types";
import MovieCardDBLocal from "@comp/movie-card-dblocal";

const MoviesRowDBLocal = ({ movies }: { movies: CastDetail[] }) => {
    return (
        <div className="my-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
                <MovieCardDBLocal movie={movie} key={movie.id} />
            ))}
        </div>
    );
};

export default MoviesRowDBLocal;
