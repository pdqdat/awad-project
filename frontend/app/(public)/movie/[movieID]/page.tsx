import type { Metadata } from "next";
import Image from "next/image";
import { Star, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";

import { Button } from "@ui/button";
import { fetchMovieDetail, fetchSimilarMovies } from "@lib/actions";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import { Badge } from "@ui/badge";
import MoviesRow from "@comp/movies-row";
import CastRow from "@comp/cast-row";
import Section from "@comp/section";
import WatchlistBtn from "@comp/watchlist-btn";

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

    const videoKey = movieDetail.trailers?.findLast(
        (result) =>
            result.name === "Official Trailer" || result.type === "Trailer",
    )?.key;

    return (
        <>
            <Section id="overview">
                <div className="flex flex-col items-center md:flex-row md:items-start">
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
                        <Button
                            variant="secondary"
                            asChild
                            className="mt-4 bg-gray-200"
                        >
                            <Link href={`/movie/${movieID}/review`}>
                                Go to review
                                <ChevronRight />
                            </Link>
                        </Button>
                        <div className="mt-4 flex space-x-4">
                            <Button
                                variant="outline"
                                className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-black hover:bg-gray-400"
                            >
                                <Heart className="h-5 w-5" />
                                <span className="absolute ml-2 mt-20 text-sm opacity-0 transition-opacity group-hover:opacity-100">
                                    Mark as favorite
                                </span>
                            </Button>
                        </div>
                        <div className="mt-12 flex w-1/5">
                            <WatchlistBtn
                                movieID={movieDetail.id}
                                className="flex-1"
                            />
                        </div>
                    </div>
                </div>
            </Section>
            <Section
                id="cast"
                heading="Top cast"
                href={`/movie/${movieID}/cast`}
            >
                <CastRow casts={movieDetail.credits.cast.slice(0, 5)} />
            </Section>
            {videoKey && (
                <Section
                    id="trailer"
                    heading="Trailer"
                    sectionClassName="bg-muted"
                >
                    <div className="relative mt-4 pb-[56.25%]">
                        <iframe
                            className="absolute left-0 top-0 h-full w-full"
                            src={`https://www.youtube.com/embed/${videoKey}`}
                            title={`${movieDetail.title} trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </Section>
            )}
            <Section id="similar" heading="Similar movies">
                <MoviesRow movies={similarMovies.data} />
            </Section>
        </>
    );
};

export default MovieDetailPage;
