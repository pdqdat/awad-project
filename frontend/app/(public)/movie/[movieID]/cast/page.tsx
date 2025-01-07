import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@ui/button";
import { fetchMovieDetail } from "@lib/actions";
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

    if (!movieDetail) {
        return <div className="container">Error fetching movie detail</div>;
    }

    const backBtn = (
        <div className="container my-4">
            <Button variant="outline" asChild>
                <Link href={`/movie/${movieID}`}>
                    <ChevronLeft />
                    Back to{" "}
                    <span className="font-bold">{movieDetail.title}</span>
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
                        Full cast of{" "}
                        <span className="text-primary">
                            {movieDetail.title} (
                            {new Date(movieDetail.release_date).getFullYear()})
                        </span>
                    </>
                }
            >
                <CastRow casts={movieDetail.credits.cast} />
            </Section>
            {backBtn}
        </>
    );
};

export default CastPage;
