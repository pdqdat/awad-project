import Image from "next/image";
import Link from "next/link";

import { Movie, MovieCredit } from "@/types";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import WatchlistBtn from "@comp/watchlist-btn";

const MovieCard = ({ movie }: { movie: Movie | MovieCredit }) => {
    return (
        <div className="space-y-2">
            <Link href={`/movie/${movie.id}`}>
                <div className="overflow-hidden rounded-xl">
                    <Image
                        src={getTmdbImageUrl(
                            tmdbPosterSizes.w342,
                            movie.poster_path,
                        )}
                        alt={movie.title}
                        width={342}
                        height={513}
                        loading="lazy"
                        className="aspect-[3/4] h-auto w-auto object-cover transition-all hover:brightness-90"
                    />
                </div>
            </Link>
            <div className="flex justify-between">
                <div className="space-y-1">
                    <h3 className="font-medium leading-none">{movie.title}</h3>
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
