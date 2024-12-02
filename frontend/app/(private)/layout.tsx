import { ReactNode } from "react";

import Header from "@comp/header";

const PrivateLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
};

export default PrivateLayout;
