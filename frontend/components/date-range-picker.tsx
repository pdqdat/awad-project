"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@ui/button";
import { Calendar } from "@ui/calendar-new";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { cn } from "@lib/utils";
import { Label } from "@ui/label";

export default function DatePicker({
    onRangeChange,
}: {
    onRangeChange: (values: [Date | undefined, Date]) => void;
}) {
    const searchParams = useSearchParams();

    // Get the "from" and "to" date values from the URL
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    // Parse the "from" and "to" date values from the URL if they exist
    // Otherwise, leave the "from" value empty and use the current date for the "to" value
    const initialFrom = fromParam ? new Date(fromParam) : undefined;
    const initialTo = toParam ? new Date(toParam) : new Date();

    // State to store the "from" and "to" date values with default values from the URL
    // If there are no "from" and "to" date values in the URL, the default values are EMPTY and THE CURRENT DATE
    const [dateRange, setDateRange] = useState<[Date | undefined, Date]>([
        initialFrom,
        initialTo,
    ]);

    // Update the "from" and "to" date values when the URL changes
    useEffect(() => {
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        const newFrom = from ? new Date(from) : undefined;
        const newTo = to ? new Date(to) : new Date();

        setDateRange([newFrom, newTo]);
    }, [searchParams]);

    // Call the onRangeChange function to send data
    // to the `MainFilter` parent when the "from" and "to" date values change
    useEffect(() => {
        onRangeChange(dateRange);
    }, [dateRange, onRangeChange]);

    return (
        <>
            <div className="my-2 flex flex-col gap-1">
                <Label className="font-normal">From</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-normal",
                                !dateRange[0] && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange[0] ? (
                                format(dateRange[0], "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dateRange[0]}
                            onSelect={(date) =>
                                setDateRange([date, dateRange[1]])
                            }
                            startMonth={new Date(1950, 1)}
                            endMonth={new Date()}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-1">
                <Label className="font-normal">To</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-normal",
                                !dateRange[1] && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange[1] ? (
                                format(dateRange[1], "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dateRange[1]}
                            onSelect={(date) =>
                                setDateRange([dateRange[0], date])
                            }
                            startMonth={new Date(1950, 1)}
                            endMonth={new Date()}
                            required
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
}
