import type { Metadata } from "next";
import Image from "next/image";
import { Star, ChevronRight } from "lucide-react";
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
import HttpStatusPage from "@comp/http-status-page";
import FavBtn from "@comp/fav-btn";
import RateBtn from "@comp/rate-btn";

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

    // Generate title with release year if the release year is available
    const title = `${movieDetail.title}${
        movieDetail.release_date &&
        !isNaN(new Date(movieDetail.release_date).getFullYear()) &&
        ` (${new Date(movieDetail.release_date).getFullYear()})`
    }`;

    return {
        title: title,
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
        return <HttpStatusPage status={404}>Movie not found</HttpStatusPage>;
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
                        <h2 className="h2 mb-4">
                            {movieDetail.title}{" "}
                            {movieDetail.release_date &&
                            !isNaN(
                                new Date(
                                    movieDetail.release_date,
                                ).getFullYear(),
                            ) ? (
                                <span className="font-normal text-muted-foreground">
                                    (
                                    {new Date(
                                        movieDetail.release_date,
                                    ).getFullYear()}
                                    )
                                </span>
                            ) : null}
                        </h2>
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
                                    {movieDetail.vote_average.toFixed(1)}
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
                        <div className="mt-12 flex w-1/5">
                            <WatchlistBtn
                                movieID={movieDetail.id}
                                className="flex-1"
                            />
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span>Your rating: </span>
                            <RateBtn movieID={movieDetail.id} />
                        </div>
                        <div className="mt-2 flex w-1/5">
                            <FavBtn movieID={movieDetail.id} />
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
                {similarMovies && similarMovies.data.length > 0 ? (
                    <MoviesRow movies={similarMovies.data} />
                ) : (
                    <div>Error fetching similar movies</div>
                )}
            </Section>
        </>
    );
};

export default MovieDetailPage;
