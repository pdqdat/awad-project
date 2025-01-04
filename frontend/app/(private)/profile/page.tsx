import Link from "next/link";

import Section from "@comp/section";
import { navigationItems } from "@lib/navigation-items";
import { Button } from "@ui/button";

const ProfilePage = async () => {
    return (
        <Section
            id="lists"
            heading="Your lists"
            containerClassName="flex gap-4"
        >
            {navigationItems[1]?.items?.map((item) => (
                <Button asChild>
                    <Link key={item.title} href={item.href}>
                        {item.title}
                    </Link>
                </Button>
            ))}
        </Section>
    );
};

export default ProfilePage;
