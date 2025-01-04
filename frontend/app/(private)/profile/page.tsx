import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import Section from "@comp/section";
import { navigationItems } from "@lib/navigation-items";

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
    const user = await currentUser();

    if (!user) {
        return <Section>Failed to fetch user info</Section>;
    }

    return (
        <>
            {navigationItems[1]?.items?.map((item) => (
                <Section
                    id={item.title.toLowerCase()}
                    key={item.title}
                    heading={item.title}
                    href={item.href}
                    containerClassName="min-h-96"
                >
                    {user.fullName}&apos;s {item.title.toLowerCase()}
                </Section>
            ))}
        </>
    );
};

export default ProfilePage;
