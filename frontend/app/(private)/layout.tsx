import { ReactNode } from "react";

import Header from "@comp/header";
import Footer from "@comp/footer";

const PrivateLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default PrivateLayout;
