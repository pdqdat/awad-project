import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { MovieInList } from "@/types";
import { Badge } from "@ui/badge";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import { formatRuntime } from "@lib/utils";
import RateBtn from "@comp/rate-btn";

const MoviesListInList = ({ movies }: { movies: MovieInList[] }) => {
    return (
        <ul className="space-y-2">
            {movies.map((movie, index) => (
                <li
                    key={movie.id}
                    className="flex flex-col gap-2 rounded-xl border p-2"
                >
                    <div>
                        <div className="flex gap-2">
                            <Link href={`/movie/${movie.id}`}>
                                <div className="aspect-[3/4] overflow-hidden rounded-xl">
                                    <Image
                                        src={getTmdbImageUrl(
                                            tmdbPosterSizes.w154,
                                            movie.poster_path,
                                        )}
                                        alt={movie.title}
                                        height={154}
                                        width={(154 * 3) / 4}
                                        loading="lazy"
                                        className="aspect-[3/4] object-cover transition-all hover:scale-105 hover:brightness-90"
                                    />
                                </div>
                            </Link>
                            <div className="space-y-1">
                                <Link
                                    href={`/movie/${movie.id}`}
                                    className="text-lg hover:text-foreground/80"
                                >
                                    <span className="text-wrap font-semibold">
                                        {index + 1}. {movie.title}
                                    </span>{" "}
                                    {movie.release_date &&
                                    !isNaN(
                                        new Date(
                                            movie.release_date,
                                        ).getFullYear(),
                                    ) ? (
                                        <>
                                            (
                                            {new Date(
                                                movie.release_date,
                                            ).getFullYear()}
                                            )
                                        </>
                                    ) : null}
                                </Link>
                                <div className="text-muted-foreground">
                                    {formatRuntime(movie.runtime)}
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center">
                                        <Star className="mr-1 size-5 text-yellow-500" />
                                        <p>
                                            <span className="font-semibold text-yellow-500">
                                                {movie.vote_average.toFixed(1)}
                                            </span>{" "}
                                            <span className="text-muted-foreground">
                                                ({movie.vote_count})
                                            </span>
                                        </p>
                                    </div>
                                    <RateBtn id={movie.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>{movie.overview}</div>
                    <div className="flex flex-wrap gap-1">
                        {movie.genres.map(({ id, name }) => (
                            <Badge
                                key={id}
                                variant="outline"
                                className="text-sm"
                            >
                                {name}
                            </Badge>
                        ))}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default MoviesListInList;
