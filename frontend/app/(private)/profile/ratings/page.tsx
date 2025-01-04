import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import Section from "@comp/section";

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
    const user = await currentUser();

    if (!user) {
        return <Section>Failed to fetch user info</Section>;
    }

    return <Section heading="Ratings">{user.fullName}&apos;s ratings</Section>;
};

export default RatingsPage;
