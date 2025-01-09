import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import WatchlistDisplay from "@comp/watchlist-display";
import RatingListDisplay from "@comp/rating-list-display";
import FavoriteDisplay from "@comp/favorite-display";

export const generateMetadata = async (): Promise<Metadata> => {
    const user = await currentUser();
    if (!user) {
        return {
            title: "Profile",
        };
    }

    return {
        title: `${user.fullName}'s Profile`,
    };
};

const ProfilePage = async () => {
    return (
        <>
            <WatchlistDisplay display="row" />
            <FavoriteDisplay display="row" />
            <RatingListDisplay display="row" />
        </>
    );
};

export default ProfilePage;
