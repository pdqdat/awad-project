import type { Metadata } from "next";
import Image from "next/image";

import { fetchMovieDetail } from "@lib/actions";
import { getTmdbImageUrl, tmdbPosterSizes } from "@/config/tmdb";
import { dateFormatter } from "@lib/utils";
import { Badge } from "@/components/ui/badge";

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
            {/* TODO: Style the movie details inside this `container` div */}
            <div className="container">
                {/* Title */}
                <h1 className="font-bold">{movieDetail.title}</h1>
                {/* Release date */}
                <p>{dateFormatter(movieDetail.release_date)}</p>
                {/* Genres */}
                <div className="flex">
                    {movieDetail.genres.map((genre) => (
                        <Badge
                            key={genre.id}
                            className="mr-2 text-sm"
                            variant="outline"
                        >
                            {genre.name}
                        </Badge>
                    ))}
                </div>
                {/* Poster */}
                <Image
                    src={getTmdbImageUrl(
                        tmdbPosterSizes.w500,
                        movieDetail.poster_path,
                    )}
                    alt={movieDetail.title}
                    width={342}
                    height={513}
                />
                {/* Overview (synopsis) */}
                <p>Overview: {movieDetail.overview}</p>
                {/* Rating */}
                {/* Feel free to use the <Star /> component from the lucide-react library to style the movie rating */}
                {/* Here's the import statement for it: `import { Star } from "lucide-react";` */}
                <p>
                    Rating: {movieDetail.vote_average} out of{" "}
                    {movieDetail.vote_count} votes
                </p>
            </div>
        </div>
    );
};

export default MovieDetailPage;
