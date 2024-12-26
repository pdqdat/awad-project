"use state";

import { useState } from "react";
// import { useSearchParams } from "next/navigation";

import { Calendar } from "@ui/calendar";

const DateRangePicker = () => {
    // const searchParams = useSearchParams();

    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
        />
    );
};

export default DateRangePicker;
