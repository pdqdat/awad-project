"use client";

import { useState } from "react";

import { Button } from "@ui/button";
import MoviesRow from "@comp/movies-row";
import { Movie } from "@/types";

const SimilarMoviesDisplay = ({ movies }: { movies: Movie[] }) => {
    // State to store the displayed movies, initially display the first 5 movies
    const [displayedMovies, setDisplayedMovies] = useState<Movie[]>(
        movies.slice(0, 5),
    );

    const loadMoreMovies = () => {
        setDisplayedMovies((prevMovies) => [
            ...prevMovies,
            ...movies.slice(prevMovies.length, prevMovies.length + 5),
        ]);
    };

    return (
        <>
            <MoviesRow movies={displayedMovies} />
            {movies.length > 5 && displayedMovies.length < movies.length && (
                <div className="w-full text-center">
                    <Button variant="outline" onClick={loadMoreMovies}>
                        Load more
                    </Button>
                </div>
            )}
        </>
    );
};

export default SimilarMoviesDisplay;
