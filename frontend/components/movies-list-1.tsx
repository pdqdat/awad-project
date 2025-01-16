import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { MovieInList } from "@/types";
import { Badge } from "@ui/badge";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import { formatRuntime } from "@lib/utils";
import RatingBtn from "@comp/rating-btn";
import { Button } from "@ui/button";
import RatingDisplay from "@comp/rating-display";
import { RatingProvider } from "@/context/rating-context";

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
                    <RatingProvider
                        initialVoteAverage={movie.vote_average}
                        initialVoteCount={movie.vote_count}
                    >
                        <div>
                            <div className="flex gap-2">
                                <Link href={`/movie/${movie.id}`}>
                                    <div className="aspect-[3/4] overflow-hidden rounded-xl">
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
                                            height={154}
                                            width={(154 * 3) / 4}
                                            loading="lazy"
                                            className="aspect-[3/4] object-cover transition-all hover:brightness-90"
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
                                        <RatingDisplay includeVoteCount small />
                                        <RatingBtn movieID={movie.id} small />
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
                    </RatingProvider>
                </li>
            ))}
        </ul>
    );
};

export default MoviesList1;
