"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@ui/button";
import { useToast } from "@hooks/use-toast";

const RateBtn = ({ movieID }: { movieID: number }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const handleOnClick = () => {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            toast({ title: `Rating for movie #${movieID}submitted!` });
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
                <LoaderCircle className="size-4 animate-spin" />
            ) : (
                <>Rate</>
            )}
        </Button>
    );
};

export default RateBtn;
