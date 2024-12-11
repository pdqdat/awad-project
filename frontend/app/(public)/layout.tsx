import { ReactNode } from "react";

import Header from "@comp/header";
import Footer from "@comp/footer";

const PublicLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default PublicLayout;
