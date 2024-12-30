"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, compareAsc } from "date-fns";

import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@ui/card";
import { Button } from "@ui/button";
import MultiSelect from "@comp/multi-select";
import { Separator } from "@ui/separator";
import { Label } from "@ui/label";
import RatingRangeSlider from "@comp/rating-range-slider";
import DateRangePicker from "@comp/date-range-picker";

const MainFilter = () => {
    // State to store the selected genres
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    // State to store the rating values
    const [ratingValues, setRatingValues] = useState([0, 10]);

    // const [from, setFrom] = useState<Date>();
    // const [to, setTo] = useState<Date>();
    const [dateRange, setDateRange] = useState<[Date | undefined, Date]>([
        undefined,
        new Date(),
    ]);

    // Get the router object
    const router = useRouter();
    // Get the search params from the URL
    const searchParams = useSearchParams();

    // Check if the apply button should be disabled
    // based on the selected genres and rating values
    const applyBtnDisabled =
        selectedGenres.length === 0 &&
        ratingValues[0] === 0 &&
        ratingValues[1] === 10 &&
        dateRange[0] === undefined;

    // Check if there are other params in the URL other than "q" (search query)
    const hasOtherParams = (() => {
        // Get the search query from the URL
        const params = new URLSearchParams(searchParams.toString());

        // Remove the search query "q" from the URL
        params.delete("q");

        // Check if there are any other params in the URL
        return Array.from(params.keys()).length > 0;
    })();

    const handleApplyFilter = () => {
        const params = new URLSearchParams();

        // Get the search query from the URL
        const q = searchParams.get("q");
        // If there is a search query, add it to the new URL
        if (q) {
            params.append("q", q);
        }

        // Add the selected genres to the new URL
        selectedGenres.forEach((genre) => params.append("genre", genre));

        // If either min or max rating is changed from default, add both to the new URL
        if (ratingValues[0] !== 0 || ratingValues[1] !== 10) {
            params.append("minRating", ratingValues[0].toString());
            params.append("maxRating", ratingValues[1].toString());
        }

        // If the "from" date is changed, add both "from" and "to" date to the new URL
        if (dateRange[0] !== undefined) {
            let [fromDate, toDate] = dateRange;
        
            // If the "from" date is after the "to" date, swap the dates
            if (fromDate && toDate && compareAsc(fromDate, toDate) === 1) {
                [fromDate, toDate] = [toDate, fromDate];
            }
        
            if (fromDate) {
                params.append("from", format(fromDate, "yyyy-MM-dd"));
            }
            params.append("to", format(toDate, "yyyy-MM-dd"));
        }

        // Push the new URL to the router
        router.push(`?${params.toString()}`);
    };

    const handleClearFilter = () => {
        const params = new URLSearchParams();

        // Get the search query from the URL
        const q = searchParams.get("q");

        // If there is a search query, add it to the new URL
        if (q) {
            params.append("q", q);
        }

        // Push the new URL to the router
        router.push(`?${params.toString()}`);
    };

    return (
        <Card className="hidden lg:sticky lg:top-4 lg:block">
            <CardHeader>
                <CardTitle className="text-xl">Filters</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Label className="text-base">Genres</Label>
                <MultiSelect onSelectionChange={setSelectedGenres} />
                <Separator />
                <Label className="text-base">Rating</Label>
                <div className="w-full pb-3 pt-7">
                    <RatingRangeSlider onRangeChange={setRatingValues} />
                </div>
                <Separator />
                <Label className="text-base">Release date</Label>
                <DateRangePicker onRangeChange={setDateRange} />
                <Separator className="mt-4" />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button
                    className="w-full"
                    disabled={applyBtnDisabled}
                    onClick={handleApplyFilter}
                >
                    Apply filter
                </Button>
                {hasOtherParams && (
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleClearFilter}
                    >
                        Clear filter
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default MainFilter;
