import type { Metadata } from "next";
import Image from "next/image";

import { fetchMovieDetail, fetchSimilarMovies } from "@lib/actions";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import { Badge } from "@ui/badge";
import CastRow from "@comp/cast-row";
import Section from "@comp/section";
import WatchlistBtn from "@comp/watchlist-btn";
import HttpStatusPage from "@comp/http-status-page";
import FavBtn from "@comp/fav-btn";
import RatingBtn from "@comp/rating-btn";
import ReviewDisplayWithInput from "@comp/review-display-with-input";
import SimilarMoviesDisplay from "@comp/similar-movies-display";
import { RatingProvider } from "@/context/rating-context";
import RatingDisplay from "@comp/rating-display";

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
            <RatingProvider
                initialVoteAverage={movieDetail.vote_average}
                initialVoteCount={movieDetail.vote_count}
            >
                <Section
                    id="overview"
                    containerClassName="flex flex-col items-center md:flex-row md:items-start"
                >
                    <Image
                        src={
                            movieDetail.poster_path
                                ? getTmdbImageUrl(
                                      tmdbPosterSizes.w500,
                                      movieDetail.poster_path,
                                  )
                                : "/img-placeholder.webp"
                        }
                        alt={movieDetail.title}
                        width={342}
                        height={513}
                        className="mb-6 rounded-xl shadow-md md:mb-0 md:mr-8"
                    />
                    <div className="flex-1">
                        <div className="mb-8 flex items-center gap-2">
                            <h2 className="h2">
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
                            <FavBtn movieID={movieDetail.id} />
                        </div>
                        <div className="mb-4 flex items-center gap-6">
                            <RatingDisplay includeVoteCount includeMaxRating />
                            <div className="flex w-20">
                                <RatingBtn
                                    movieID={movieDetail.id}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        <p className="mb-4">{movieDetail.overview}</p>
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
                        <div className="mt-6 flex w-48">
                            <WatchlistBtn
                                movieID={movieDetail.id}
                                className="flex-1"
                            />
                        </div>
                    </div>
                </Section>
                <Section
                    id="cast"
                    heading="Top cast"
                    href={`/movie/${movieID}/cast`}
                >
                    {movieDetail.credits.cast.length === 0 && (
                        <div>
                            We don&apos;t have any cast added to this movie.
                        </div>
                    )}
                    <CastRow casts={movieDetail.credits.cast.slice(0, 5)} />
                </Section>
                {videoKey && (
                    <Section
                        id="trailer"
                        heading="Trailer"
                        sectionClassName="bg-muted"
                    >
                        <div className="relative mx-auto mt-4 max-w-6xl pb-[56.25%]">
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
                <Section
                    id="review"
                    heading="User reviews"
                    href={`/movie/${movieID}/review`}
                >
                    <ReviewDisplayWithInput movieID={movieID} compact />
                </Section>
                <Section
                    id="similar"
                    heading="Similar movies"
                    sectionClassName="bg-muted"
                >
                    {similarMovies && similarMovies.data.length > 0 ? (
                        <SimilarMoviesDisplay movies={similarMovies.data} />
                    ) : (
                        <div>Error fetching similar movies</div>
                    )}
                </Section>
            </RatingProvider>
        </>
    );
};

export default MovieDetailPage;
