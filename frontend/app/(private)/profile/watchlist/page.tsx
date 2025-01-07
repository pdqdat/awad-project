import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import WatchlistDisplay from "@comp/watchlist-display";

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
    return <WatchlistDisplay display="list" />;
};

export default WatchlistPage;
