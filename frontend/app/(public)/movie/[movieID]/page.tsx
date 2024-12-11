import type { Metadata } from "next";
import Image from "next/image";
import { Star } from "lucide-react";

import { fetchMovieDetail } from "@lib/actions";
import { getTmdbImageUrl, tmdbPosterSizes } from "@/config/tmdb";
import { Badge } from "@ui/badge";

export const metadata: Metadata = {
    title: "Movie Detail",
    description: `Movie description`,
};

const MovieDetailPage = async ({
    params,
}: {
    params: Promise<{ movieID: string }>;
}) => {
    const { movieID } = await params;
    const movieDetail = await fetchMovieDetail(movieID);

    if (!movieDetail) {
        return <div>Error fetching movie detail</div>;
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center md:flex-row md:items-start">
                    {/* Poster */}
                    <Image
                        src={getTmdbImageUrl(
                            tmdbPosterSizes.w500,
                            movieDetail.poster_path,
                        )}
                        alt={movieDetail.title}
                        width={342}
                        height={513}
                        className="mb-6 rounded-lg shadow-md md:mb-0 md:mr-8"
                    />
                    {/* Movie info */}
                    <div className="flex-1">
                        <h1 className="mb-4 text-4xl font-bold">
                            {movieDetail.title}
                        </h1>
                        <p className="mb-4 text-muted-foreground">
                            {new Date(movieDetail.release_date).getFullYear()}
                        </p>
                        <div className="mb-4 flex flex-wrap gap-2">
                            {movieDetail.genres.map((genre) => (
                                <Badge
                                    key={genre.id}
                                    variant="secondary"
                                    className="text-sm"
                                >
                                    {genre.name}
                                </Badge>
                            ))}
                        </div>
                        <div className="group mb-4 flex items-center">
                            <Star className="group-hover:animate-wiggle mr-1 text-yellow-500" />
                            <p className="mr-2 text-lg font-semibold">
                                <span className="transition-colors group-hover:text-yellow-500">
                                    {movieDetail.vote_average}
                                </span>{" "}
                                / 10{" "}
                                <span className="font-normal text-muted-foreground">
                                    ({movieDetail.vote_count} votes)
                                </span>
                            </p>
                        </div>
                        <p>{movieDetail.overview}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;
