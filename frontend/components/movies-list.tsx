import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { MovieSearchResult } from "@/types";
import { tmdbPosterSizes, getTmdbImageUrl } from "@/config/tmdb";import {Badge } from "@ui/badge";

const MoviesList = ({ movies }: { movies: MovieSearchResult[] }) => {
    return (
        <ul className="space-y-2">
            {movies.map((movie) => (
                <li
                    key={movie.id}
                    className="overflow-hidden rounded-xl border"
                >
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
                        <div className="flex flex-1 flex-col gap-2 p-2">
                            <div className="text-lg">
                                <span className="text-wrap font-semibold">
                                    {movie.title}
                                </span>{" "}
                                {movie.release_date &&
                                !isNaN(
                                    new Date(movie.release_date).getFullYear(),
                                ) ? (
                                    <>
                                        (
                                        {new Date(
                                            movie.release_date,
                                        ).getFullYear()}
                                        )
                                    </>
                                ) : null}
                            </div>
                            <div className="group mb-4 flex items-center">
                                <Star className="mr-1 size-5 text-yellow-500" />
                                <p className="mr-2 font-semibold">
                                    <span className="text-yellow-500">
                                        {movie.vote_average}
                                    </span>{" "}
                                    / 10
                                </p>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                                {movie.genres.map(({id, name}) => (
                                    <Badge
                                        key={id}
                                        variant="outline"
                                        className="text-sm"
                                    >
                                        {name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default MoviesList;
