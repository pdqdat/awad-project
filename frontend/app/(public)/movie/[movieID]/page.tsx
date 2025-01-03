import type { Metadata } from "next";
import Image from "next/image";
import { Star, ChevronRight, Heart, Bookmark } from "lucide-react";
import Link from "next/link";

import { Button } from "@ui/button";
import { fetchMovieDetail, fetchSimilarMovies } from "@lib/actions";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import { Badge } from "@ui/badge";
import MoviesRow from "@comp/movies-row";
import CastRow from "@comp/cast-row";
import Section from "@comp/section";

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

    console.log(movieDetail);
    console.log(movieID);

    if (!movieDetail) {
        return <div className="container">Error fetching movie detail</div>;
    }

    const similarMovies = await fetchSimilarMovies(movieID);

    const videoKey = movieDetail.trailers?.findLast(result => result.name === 'Official Trailer' || result.type === 'Trailer')?.key;
    console.log(movieDetail.trailers);

    console.log(videoKey);

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
                        <Button variant="secondary" asChild className="mt-4 bg-gray-200 ">
                            <Link href={`/movie/${movieID}/review`}>
                                Go to review
                                <ChevronRight />
                            </Link>
                        </Button>

                        <div className="mt-4 flex space-x-4">
                            <Button variant="outline" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-black hover:bg-gray-400 group">
                                <Heart className="w-5 h-5" />
                                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-sm mt-20 ml-2">Mark as favorite</span>
                            </Button>
                            <Button variant="outline" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-black hover:bg-gray-400 group">
                                <Bookmark className="w-5 h-5" />
                                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-sm mt-20 ml-2">Add to watchlist</span>
                            </Button>
                        </div>

                    </div>
                </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">Top Cast</h2>
                    </div>

                    <CastRow casts={movieDetail.credits.cast.slice(0, 5)} />

                <Button variant="secondary" asChild className="mt-4 bg-gray-200" >
                    <Link href={`/movie/${movieID}/cast`}>
                        Full cast
                        <ChevronRight />
                    </Link>
                </Button>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Trailer</h2>
                    <div className="relative pb-[56.25%] mt-4">
                        <iframe
                            className="absolute top-0 left-0 h-full w-full"
                            src={`https://www.youtube.com/embed/${videoKey}`}
                            title={`${movieDetail.title} Trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">
                            Similar Movies
                        </h2>
                    </div>

                    <MoviesRow movies={similarMovies.data} />
                </div>
            </div>
            <Section className="bg-muted" id="hehe" heading="Hehe">
                <div className="min-h-screen">hehehehehe</div>
            </Section>
        </>
    );
};

export default MovieDetailPage;
