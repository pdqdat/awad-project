import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import Section from "@comp/section";
import { fetchWatchlist } from "@lib/actions";

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
    const watchlist = await fetchWatchlist();
    if (!watchlist) {
        return <Section>Error fetching your watchlist</Section>;
    }

    const favorites = [];
    const ratings = [];

    return (
        <>
            <Section
                id="watchlist"
                heading="Watchlist"
                href="/profile/watchlist"
            >
                {watchlist.length !== 0 ? (
                    watchlist.map((movie) => (
                        <div key={movie.id}>
                            <h2>{movie.title}</h2>
                            <p>{movie.overview}</p>
                        </div>
                    ))
                ) : (
                    <div>Your watchlist is empty</div>
                )}
            </Section>
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
