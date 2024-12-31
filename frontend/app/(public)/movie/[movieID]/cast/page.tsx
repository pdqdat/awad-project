import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@ui/button";
import { fetchMovieDetail } from "@lib/actions";
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
        title: `${movieDetail.title} - Cast`,
        description: movieDetail.overview,
    };
};

const CastPage = async ({
    params,
}: {
    params: Promise<{ movieID: string }>;
}) => {
    const { movieID } = await params;
    const movieDetail = await fetchMovieDetail(movieID);

    if(!movieDetail) {
        return <div className="container">Error fetching movie detail</div>;
    }

    return (
        <div>
            <div className="container py-8">
                <Button variant="secondary" asChild>
                    <Link href={`/movie/${movieID}`}>
                        <ChevronLeft />
                        Back to movie detail page
                    </Link>
                </Button>
                <CastRow casts={movieDetail.credits.cast} />
            </div>
        </div>
    );
};

export default CastPage;
