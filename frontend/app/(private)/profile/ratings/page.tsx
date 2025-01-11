import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import RatingListDisplay from "@comp/rating-list-display";

export const generateMetadata = async (): Promise<Metadata> => {
    const user = await currentUser();

    if (!user) {
        return {
            title: "Ratings",
        };
    }

    return {
        title: `${user.fullName}'s Ratings`,
    };
};

const RatingsPage = async () => {
    return <RatingListDisplay display="list" />;
};

export default RatingsPage;
