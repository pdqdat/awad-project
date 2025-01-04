import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@ui/button";
import { fetchMovieDetail } from "@lib/actions";
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
    const movieDetail = await fetchMovieDetail(movieID);

    if (!movieDetail) {
        return <div className="container">Error fetching movie detail</div>;
    }

    const backBtn = (
        <div className="container my-4">
            <Button variant="outline" asChild>
                <Link href={`/movie/${movieID}`}>
                    <ChevronLeft />
                    Back to {movieDetail.title} details
                </Link>
            </Button>
        </div>
    );

    return (
        <>
            {backBtn}
            <Section
                heading={
                    <>
                        Reviews of{" "}
                        <span className="text-primary">
                            {movieDetail.title} (
                            {new Date(movieDetail.release_date).getFullYear()})
                        </span>
                    </>
                }
            >
                Reviews...
            </Section>
        </>
    );
};

export default MovieReviewPage;
