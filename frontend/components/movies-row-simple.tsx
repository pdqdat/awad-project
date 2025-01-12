import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { MovieInList } from "@/types";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import RateBtn from "@comp/rate-btn";

const MoviesRowSimple = ({ movies }: { movies: MovieInList[] }) => {
    return (
        <div className="my-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
                <div
                    key={movie.id}
                    className="overflow-hidden rounded-xl shadow-lg"
                >
                    <Link href={`/movie/${movie.id}`}>
                        <Image
                            src={
                                movie.poster_path
                                    ? getTmdbImageUrl(
                                          tmdbPosterSizes.w342,
                                          movie.poster_path,
                                      )
                                    : "/img-placeholder.webp"
                            }
                            alt={movie.title}
                            width={342}
                            height={513}
                            loading="lazy"
                            className="aspect-[3/4] h-auto w-auto object-cover transition-all hover:brightness-90"
                        />
                    </Link>
                    <div className="space-y-2 p-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <Star className="mr-1 size-5 text-yellow-500" />
                                <span className="font-semibold text-yellow-500">
                                    {movie.vote_average.toFixed(1)}
                                </span>
                            </div>
                            <RateBtn movieID={movie.id} small disabled />
                        </div>
                        <div className="font-medium">
                            <Link href={`/movie/${movie.id}`}>
                                {movie.title}{" "}
                                {movie.release_date &&
                                !isNaN(
                                    new Date(movie.release_date).getFullYear(),
                                ) ? (
                                    <span className="font-normal text-muted-foreground">
                                        (
                                        {new Date(
                                            movie.release_date,
                                        ).getFullYear()}
                                        )
                                    </span>
                                ) : null}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MoviesRowSimple;
