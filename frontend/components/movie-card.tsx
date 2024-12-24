import Image from "next/image";
import Link from "next/link";

import { Movie } from "@/types";
import { tmdbPosterSizes, getTmdbImageUrl } from "@/config/tmdb";

interface MovieCardProps {
    movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
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
                        className="aspect-[3/4] h-auto w-auto object-cover transition-all hover:scale-105"
                    />
                </div>
            </Link>
            <div className="space-y-1">
                <h3 className="font-medium leading-none">{movie.title}</h3>
                <p className="text-sm text-muted-foreground">
                    {new Date(movie.release_date).getFullYear()}
                </p>
            </div>
        </div>
    );
};

export default MovieCard;
