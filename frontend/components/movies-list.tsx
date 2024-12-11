import Image from "next/image";
import Link from "next/link";

import { MovieSearchResult } from "@/types";
import { tmdbPosterSizes, getTmdbImageUrl } from "@/config/tmdb";

const MoviesList = ({ movies }: { movies: MovieSearchResult[] }) => {
    return (
        <ul className="space-y-2">
            {movies.map((movie) => (
                <li key={movie.id} className="flex rounded-md border">
                    <Link href={`/movie/${movie.id}`} className="flex gap-2">
                        <div className="aspect-[3/4] overflow-hidden">
                            <Image
                                src={getTmdbImageUrl(
                                    tmdbPosterSizes.w154,
                                    movie.poster_path,
                                )}
                                alt={movie.title}
                                width={154}
                                height={231}
                                loading="lazy"
                                className="aspect-[3/4] object-cover transition-all hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-col p-2">
                            <div className="text-lg">
                                <span className="font-semibold">
                                    {movie.title}
                                </span>{" "}
                                ({new Date(movie.release_date).getFullYear()})
                            </div>
                            {/* TODO: Display movie genres */}
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default MoviesList;
