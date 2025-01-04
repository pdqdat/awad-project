import Section from "@comp/section";
import { navigationItems } from "@lib/navigation-items";

const ProfilePage = async () => {
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
                    Your {item.title.toLowerCase()}
                </Section>
            ))}
        </>
    );
};

export default ProfilePage;
