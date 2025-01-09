import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import Section from "@comp/section";
import WatchlistDisplay from "@comp/watchlist-display";
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
    const ratings = [];

    return (
        <>
            <WatchlistDisplay display="row" />

            <FavoriteDisplay display="row" />

            <Section
                id="ratings"
                heading="Ratings"
                href="/profile/ratings"
                containerClassName="min-h-96"
            >
                {ratings.length !== 0 ? (
                    <div>Feature being implemented</div>
                ) : (
                    <div>Your favorites is empty</div>
                )}
            </Section>
        </>
    );
};

export default ProfilePage;
