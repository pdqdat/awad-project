import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import Section from "@comp/section";
import WatchlistDisplay from "@comp/watchlist-display";
import RatingListDisplay from "@comp/rating-list-display";

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
    const favorites = [];

    return (
        <>
            <WatchlistDisplay display="row" />
            <Section
                id="favorites"
                heading="Favorites"
                href="/profile/favorites"
                containerClassName="min-h-96"
            >
                {favorites.length !== 0 ? (
                    <div>Feature being implemented</div>
                ) : (
                    <div>Your favorites is empty</div>
                )}
            </Section>
            <RatingListDisplay display="row" />
        </>
    );
};

export default ProfilePage;
