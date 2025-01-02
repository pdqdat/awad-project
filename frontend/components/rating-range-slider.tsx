"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { DualRangeSlider } from "@ui/dual-range-slider";

const RatingRangeSlider = ({
    onRangeChange,
}: {
    onRangeChange: (values: [number, number]) => void;
}) => {
    const searchParams = useSearchParams();

    // Get the min and max rating from the URL
    const minRatingParam = searchParams.get("minRating");
    const maxRatingParam = searchParams.get("maxRating");

    // Parse the min and max rating from the URL if they exist
    // Otherwise use 0 for the min rating and 10 for the max rating
    const initialMinRating = Number(minRatingParam) || 0;
    const initialMaxRating = Number(maxRatingParam) || 10;

    // State to store the min and max rating with default values from the URL
    // If there are no min and max rating in the URL, the default values are 0 and 10
    const [ratingRange, setRatingRange] = useState<[number, number]>([
        initialMinRating,
        initialMaxRating,
    ]);

    // Update the min and max rating values when the URL changes
    useEffect(() => {
        const minRating = searchParams.get("minRating");
        const maxRating = searchParams.get("maxRating");

        const newMinRating = Number(minRating) || 0;
        const newMaxRating = Number(maxRating) || 10;

        setRatingRange([newMinRating, newMaxRating]);
    }, [searchParams]);

    // Call the onRangeChange function to send data 
    // to the `MainFilter` parent when the min and max rating values change
    useEffect(() => {
        onRangeChange(ratingRange);
    }, [ratingRange, onRangeChange]);

    return (
        <DualRangeSlider
            label={(value) => value}
            value={ratingRange}
            onValueChange={(value: number[]) => setRatingRange([value[0], value[1]])}
            min={0}
            max={10}
            step={1}
        />
    );
};

export default RatingRangeSlider;
