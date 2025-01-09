import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import FavoriteDisplay from "@/components/favorite-display";

export const generateMetadata = async (): Promise<Metadata> => {
    const user = await currentUser();

    if (!user) {
        return {
            title: "Favorites",
        };
    }

    return {
        title: `${user.fullName}'s Favorites`,
    };
};

const FavoritesPage = async () => {
    return (
        <FavoriteDisplay display="list" />
    );
};

export default FavoritesPage;
