"use client";

import { Star } from "lucide-react";
import { cn } from "@lib/utils";

import { useRating } from "@/context/rating-context";

const RatingDisplay = ({
    includeVoteCount = false,
    includeMaxRating = false,
    small = false,
}: {
    includeVoteCount?: boolean;
    includeMaxRating?: boolean;
    small?: boolean;
}) => {
    const { voteAverage, voteCount } = useRating();

    return (
        <div className="flex items-center">
            <Star className={cn(small && "size-5", "mr-1 text-yellow-500")} />
            <p
                className={cn(
                    small ? "text-base" : "text-lg",
                    "mr-2 font-semibold",
                )}
            >
                <span className="text-yellow-500 transition-colors">
                    {voteAverage.toFixed(1)}
                </span>
                {includeMaxRating && <span> / 10</span>}
                {includeVoteCount && (
                    <span className="font-normal text-muted-foreground">
                        {" "}
                        ({voteCount}{!small && " votes"})
                    </span>
                )}
            </p>
        </div>
    );
};

export default RatingDisplay;
