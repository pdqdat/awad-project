import Image from "next/image";
import Link from "next/link";

import { Movie, MovieCredit } from "@/types";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import WatchlistBtn from "@comp/watchlist-btn";

const MovieCard = ({ movie }: { movie: Movie | MovieCredit }) => {
    return (
        <div
            key={movie.id}
            className="overflow-hidden rounded-xl shadow-lg transition-shadow hover:shadow-xl"
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
            <div className="flex justify-between p-4">
                <div className="space-y-1">
                    <Link
                        href={`/movie/${movie.id}`}
                        className="font-medium leading-none"
                    >
                        {movie.title}
                    </Link>
                    {movie.release_date &&
                    !isNaN(new Date(movie.release_date).getFullYear()) ? (
                        <p className="text-sm text-muted-foreground">
                            {new Date(movie.release_date).getFullYear()}
                        </p>
                    ) : null}
                </div>
                <WatchlistBtn movieID={movie.id} small className="shrink-0" />
            </div>
        </div>
    );
};

export default MovieCard;
