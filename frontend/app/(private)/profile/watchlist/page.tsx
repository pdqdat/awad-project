import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import Section from "@comp/section";

export const generateMetadata = async (): Promise<Metadata> => {
    const user = await currentUser();

    if (!user) {
        return {
            title: "Watchlist",
        };
    }

    return {
        title: `${user.fullName}'s Watchlist`,
    };
};

const WatchlistPage = async () => {
    const user = await currentUser();

    if (!user) {
        return <Section>Failed to fetch user info</Section>;
    }
    
    return (
        <Section heading="Watchlist">{user.fullName}&apos;s watchlist</Section>
    );
};

export default WatchlistPage;
