import type { Metadata } from "next";
import Image from "next/image";

import { fetchMovieDetail } from "@lib/actions";
import { getTmdbImageUrl, tmdbPosterSizes } from "@/config/tmdb";
import { dateFormatter } from "@lib/utils";
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

            {/* <div className="bg-gray-900 text-white min-h-screen"> */}
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start">
                    {/* Poster */}
                    <Image
                        src={getTmdbImageUrl(
                            tmdbPosterSizes.w500,
                            movieDetail.poster_path
                        )}
                        alt={movieDetail.title}
                        width={342}
                        height={513}
                        className="rounded-lg shadow-md mb-6 md:mb-0 md:mr-8"
                    />

                    {/* Movie Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-4">{movieDetail.title}</h1>
                        <p className="text-gray-400 text-sm mb-4">
                            Release Date: {dateFormatter(movieDetail.release_date)}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {movieDetail.genres.map((genre) => (
                                <Badge
                                    key={genre.id}
                                    className="bg-gray-800 text-gray-300 border border-gray-700 px-2 py-1 rounded"
                                >
                                    {genre.name}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-lg mb-6">{movieDetail.overview}</p>

                        <div className="flex items-center">
                            <p className="text-lg font-semibold mr-2">
                                Rating: {movieDetail.vote_average}
                            </p>
                            <span className="text-gray-400 text-sm">
                                ({movieDetail.vote_count} votes)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}

            
            
            
        </div>
    );
};

export default MovieDetailPage;
