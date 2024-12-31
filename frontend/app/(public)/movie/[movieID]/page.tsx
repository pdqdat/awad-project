import type { Metadata } from "next";
import Image from "next/image";
import { Star, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@ui/button";
import { fetchMovieDetail, fetchSimilarMovies } from "@lib/actions";
import { getTmdbImageUrl, tmdbPosterSizes } from "@/config/tmdb";
import { Badge } from "@ui/badge";
import MoviesRow from "@comp/movies-row";
import CastRow from "@comp/cast-row";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ movieID: string }>;
}): Promise<Metadata> => {
    const { movieID } = await params;
    const movieDetail = await fetchMovieDetail(movieID);

    if (!movieDetail) {
        return {
            title: "Movie not found",
        };
    }

    return {
        title: `${movieDetail.title} (${new Date(movieDetail.release_date).getFullYear()})`,
        description: movieDetail.overview,
    };
};

const MovieDetailPage = async ({
    params,
}: {
    params: Promise<{ movieID: string }>;
}) => {
    const { movieID } = await params;
    const movieDetail = await fetchMovieDetail(movieID);

    if (!movieDetail) {
        return <div className="container">Error fetching movie detail</div>;
    }

    const similarMovies = await fetchSimilarMovies(movieID);

    if (!movieDetail) {
        return <div>Error fetching movie detail</div>;
    }

    return (
        <div>
            <div className="container mx-auto py-8">
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
                        className="mb-6 rounded-xl shadow-md md:mb-0 md:mr-8"
                    />
                    {/* Movie info */}
                    <div className="flex-1">
                        <h1 className="mb-4 text-4xl font-bold">
                            {movieDetail.title}{" "}
                            <span className="font-normal text-muted-foreground">
                                (
                                {new Date(
                                    movieDetail.release_date,
                                ).getFullYear()}
                                )
                            </span>
                        </h1>
                        <div className="mb-4 flex flex-wrap gap-2">
                            {movieDetail.genres.map((genre) => (
                                <Badge
                                    key={genre.id}
                                    variant="outline"
                                    className="text-sm"
                                >
                                    {genre.name}
                                </Badge>
                            ))}
                        </div>
                        <div className="group mb-4 flex items-center">
                            <Star className="mr-1 text-yellow-500 group-hover:animate-wiggle" />
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
                        <Button variant="secondary" asChild>
                            <Link href={`/movie/${movieID}/review`}>
                                Go to review
                                <ChevronRight />
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Top Cast</h2>
                </div>

                <CastRow casts={movieDetail.credits.cast.slice(0, 5)} />

                <Button variant="secondary" asChild>
                    <Link href={`/movie/${movieID}/cast`}>
                        Full Cast
                        <ChevronRight />
                    </Link>
                </Button>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Recommendations</h2>
                </div>

                <MoviesRow movies={similarMovies.data} />
            </div>
        </div>
    );
};

export default MovieDetailPage;
