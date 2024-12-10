import Image from "next/image";
import Link from "next/link";

import { Movie } from "@/types";
import { tmdbPosterSizes, getTmdbImageUrl } from "@/config/tmdb";

interface MovieCardProps {
    movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
    return (
        <Link href={`/movie/${movie.id}`} className="">
            <Image
                src={getTmdbImageUrl(tmdbPosterSizes.w342, movie.poster_path)}
                alt={movie.title}
                width={342}
                height={513}
            />
        </Link>
    );
};

export default MovieCard;
