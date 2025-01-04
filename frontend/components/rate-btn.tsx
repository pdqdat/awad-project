"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@ui/button";

const RateBtn = ({ id }: { id: number }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleOnClick = () => {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            alert(`rate movie #${id}`);
        }, 2000);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-sm"
            disabled={isLoading}
            onClick={handleOnClick}
        >
            {isLoading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <>Rate</>
            )}
        </Button>
    );
};

export default RateBtn;
