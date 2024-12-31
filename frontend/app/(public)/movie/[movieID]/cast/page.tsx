import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@ui/button";
import { fetchMovieDetail } from "@/lib/actions";
import CastRow from "@/components/cast-row";

export const metadata: Metadata = {
    title: "Reviews for movie ...",
};

const CastPage = async ({
    params,
}: {
    params: Promise<{ movieID: string }>;
}) => {
    const { movieID } = await params;
    const movieDetail = await fetchMovieDetail(movieID);

    
    return (
        <div>
            <div className="container py-8">
                <Button variant="secondary" asChild>
                    <Link href={`/movie/${movieID}`}>
                        <ChevronLeft />
                        Back to movie detail page
                    </Link>
                </Button>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Top Billed Cast</h2>
                </div>
                    
                <CastRow casts={movieDetail.credits.cast} />
            </div>
        </div>
    );
};

export default CastPage;
