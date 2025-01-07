"use client";

import { useEffect } from "react";

import HttpStatusPage from "@comp/http-status-page";
import { Button } from "@ui/button";

const Error = ({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <HttpStatusPage status={500}>
            <h3 className="h3 mb-6">Something went wrong!</h3>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
        </HttpStatusPage>
    );
};

export default Error;
