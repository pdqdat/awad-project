import { ReactNode } from "react";

import ProfileSection from "@comp/profile-section";

const ProfileLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <ProfileSection />
            {children}
        </>
    );
};

export default ProfileLayout;
