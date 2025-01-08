import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { fetchCastDetail } from "@lib/actions";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import MoviesRow from "@comp/movies-row";
import ReadMore from "@comp/read-more";
import ReadMoreList from "@comp/read-more-list";
import HttpStatusPage from "@comp/http-status-page";
import { Button } from "@ui/button";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ castID: string }>;
}): Promise<Metadata> => {
    const { castID } = await params;
    const castDetail = await fetchCastDetail(castID);

    if (!castDetail) {
        return {
            title: "Cast not found",
        };
    }

    return {
        title: `${castDetail.name}`,
        description: castDetail.biography,
    };
};

const CastDetailPage = async ({
    params,
}: {
    params: Promise<{ castID: string }>;
}) => {
    const { castID } = await params;
    const castDetail = await fetchCastDetail(castID);

    if (!castDetail) {
        return <HttpStatusPage status={404}>Cast not found</HttpStatusPage>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center md:flex-row md:items-start">
                <Image
                    src={getTmdbImageUrl(
                        tmdbPosterSizes.w500,
                        castDetail.profile_path,
                    )}
                    alt={castDetail.name}
                    width={342}
                    height={513}
                    className="mb-6 rounded-lg shadow-md md:mb-0 md:mr-8"
                />
                <div className="flex-1">
                    <h2 className="h2">{castDetail.name}</h2>
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">Biography</h2>
                        <ReadMore text={castDetail.biography} limit={700} />
                    </div>
                    <div className="mt-4 space-y-2 text-gray-700">
                        {castDetail.known_for_department && (
                            <p>
                                <strong>Known For:</strong>{" "}
                                {castDetail.known_for_department}
                            </p>
                        )}
                        {castDetail.birthday && (
                            <p>
                                <strong>Birthday:</strong> {castDetail.birthday}
                            </p>
                        )}
                        {castDetail.deathday && (
                            <p>
                                <strong>Deathday:</strong> {castDetail.deathday}
                            </p>
                        )}
                        {castDetail.place_of_birth && (
                            <p>
                                <strong>Place of Birth:</strong>{" "}
                                {castDetail.place_of_birth}
                            </p>
                        )}
                        <p>
                            <strong>Gender:</strong>{" "}
                            {castDetail.gender === 1
                                ? "Female"
                                : castDetail.gender === 2
                                  ? "Male"
                                  : "Unknown"}
                        </p>
                        {castDetail.homepage && (
                            <p>
                                <strong>Homepage:</strong>{" "}
                                <Button
                                    variant="link"
                                    className="h-fit p-0 text-base font-normal"
                                    asChild
                                >
                                    <Link href={castDetail.homepage}>
                                        {castDetail.homepage}
                                    </Link>
                                </Button>
                            </p>
                        )}
                    </div>
                    {castDetail.also_known_as?.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold">
                                Also Known As
                            </h2>
                            <ReadMoreList items={castDetail.also_known_as} />
                        </div>
                    )}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Known For</h2>
                    </div>
                    <MoviesRow movies={castDetail.movie_credits} />
                </div>
            </div>
        </div>
    );
};

export default CastDetailPage;
