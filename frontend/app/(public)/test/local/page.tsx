"use client";

import { toast } from "sonner";

import { Button } from "@ui/button";

const LocalTestPage = () => {
    return (
        <div className="container flex min-h-96 items-center justify-center">
            <Button
                onClick={() =>
                    toast.info("Dat dep trai", {
                        // richColors: false,
                        description: "HCMUS",
                        position: "top-center",
                        action: {
                            label: "Visit my Github",
                            onClick: () =>
                                window.open(
                                    "https://github.com/pdqdat",
                                    "_blank",
                                ),
                        },
                    })
                }
            >
                Dat dep trai
            </Button>
        </div>
    );
};

export default LocalTestPage;
