import { currentUser } from "@clerk/nextjs/server";

import Section from "@comp/section";
import { Avatar, AvatarImage, AvatarFallback } from "@ui/avatar";

const ProfileSection = async () => {
    const user = await currentUser();

    // console.log(user);

    if (!user) {
        return <Section>Failed to fetch user info</Section>;
    }

    return (
        <Section
            sectionClassName="bg-secondary-foreground text-background"
            containerClassName="flex items-center gap-4"
        >
            <Avatar className="size-24">
                <AvatarImage
                    src={user.imageUrl}
                    alt={user.fullName || "User avatar"}
                    className="object-cover"
                />
                <AvatarFallback className="text-sm">
                    {user.fullName}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <div>{user.fullName}</div>
                <div>
                    Member since{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })}
                </div>
            </div>
        </Section>
    );
};

export default ProfileSection;
