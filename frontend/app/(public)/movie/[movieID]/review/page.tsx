import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@ui/button";
import { fetchMovieDetail } from "@lib/actions";

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
        title: `${movieDetail.title} - Review`,
        description: movieDetail.overview,
    };
};

const MovieReviewPage = async ({
    params,
}: {
    params: Promise<{ movieID: string }>;
}) => {
    const { movieID } = await params;
    // const review = await fetch(...)
    // if (!review) {
    //     return <div>Error fetching review</div>;
    // }

    return (
        <div>
            <div className="container py-8">
                <Button variant="secondary" asChild>
                    <Link href={`/movie/${movieID}`}>
                        <ChevronLeft />
                        Back to movie detail page
                    </Link>
                </Button>
                Review Page for movie <strong>{movieID}</strong>
            </div>
        </div>
    );
};

export default MovieReviewPage;
