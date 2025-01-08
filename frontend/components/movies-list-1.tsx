import Image from "next/image";
import Link from "next/link";
import { Star, X } from "lucide-react";

import { MovieInList } from "@/types";
import { Badge } from "@ui/badge";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import { formatRuntime } from "@lib/utils";
import RateBtn from "@comp/rate-btn";
import { Button } from "@ui/button";

const MoviesList1 = ({
    movies,
    onRemove,
}: {
    movies: MovieInList[];
    onRemove: (id: number) => void;
}) => {
    return (
        <ul className="space-y-2">
            {movies.map((movie, index) => (
                <li
                    key={movie.id}
                    className="flex flex-col gap-2 rounded-xl border p-4"
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
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
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
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemove(movie.id)}
                                    >
                                        <X />
                                    </Button>
                                </div>
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
                                    <RateBtn
                                        movieID={movie.id}
                                        small
                                        disabled
                                    />
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

export default MoviesList1;
