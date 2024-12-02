import { ReactNode } from "react";

import Header from "@comp/header";

const PublicLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
};

export default PublicLayout;
