import React from "react";
import Link from "next/link";

import { Button } from "@ui/button";

const HttpStatusPage = ({
    status,
    children,
}: {
    status?: number;
    children: React.ReactNode;
}) => {
    return (
        <div className="flex min-h-72 flex-col items-center justify-center gap-3 sm:min-h-[32rem]">
            <h1 className="text-[100px] leading-none text-primary sm:text-[120px]">
                {status}
            </h1>

            <div className="space-y-6 text-center">
                {children && <div className="pt-1">{children}</div>}

                <Button variant="outline" asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </div>
    );
};

export default HttpStatusPage;
