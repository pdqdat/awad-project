import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import Section from "@comp/section";

export const generateMetadata = async (): Promise<Metadata> => {
    const user = await currentUser();

    if (!user) {
        return {
            title: "Favorites",
        };
    }

    return {
        title: `${user.fullName}'s Favorites"`,
    };
};

const FavoritesPage = async () => {
    const user = await currentUser();

    if (!user) {
        return <Section>Failed to fetch user info</Section>;
    }

    return (
        <Section heading="Favorites">{user.fullName}&apos;s favorites</Section>
    );
};

export default FavoritesPage;
