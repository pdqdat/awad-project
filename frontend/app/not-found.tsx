"use client";

import { usePathname } from "next/navigation";

import HttpStatusPage from "@comp/http-status-page";

const NotFound = () => {
    const pathname = usePathname();

    return (
        <HttpStatusPage status={404}>
            <span className="cursor-not-allowed text-primary">{pathname}</span>{" "}
            could not be found
        </HttpStatusPage>
    );
};
export default NotFound;
