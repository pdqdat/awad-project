import type { Metadata } from "next";
import Image from "next/image";

import { fetchCastDetail } from "@lib/actions";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import MoviesRow from "@comp/movies-row";
import ReadMore from "@/components/read-more";
import ReadMoreList from "@/components/read-more-list";


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
        return <div className="container">Error fetching cast detail</div>;
    }

    if (!castDetail) {
        return <div>Error fetching cast detail</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center md:flex-row md:items-start">
                {/* Profile Image */}
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
                {/* Cast Info */}
                <div className="flex-1">
                    <h1 className="mb-4 text-4xl font-bold">
                        {castDetail.name}
                    </h1>

                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">Biography</h2>
                        <ReadMore text={castDetail.biography} limit={250} />
                    </div>

                    <div className="mt-4"></div>

                    <div className="space-y-2 text-gray-700">
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
                                <a
                                    href={castDetail.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {castDetail.homepage}
                                </a>
                            </p>
                        )}
                    </div>
                    {castDetail.also_known_as?.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold">
                                Also Known As
                            </h2>
                            <ReadMoreList items={castDetail.also_known_as} />

                            {/* <ul className="list-inside list-disc">
                                {castDetail.also_known_as.map((aka) => (
                                    <li key={aka}>{aka}</li>
                                ))}
                            </ul> */}
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
