"use client";

import { useState } from "react";

import { Button } from "@ui/button";

const ReadMoreList = ({
    items,
    limit = 5,
}: {
    items: string[];
    limit?: number;
}) => {
    const [expanded, setExpanded] = useState(false);

    const isLong = items.length > limit;
    const displayItems = expanded ? items : items.slice(0, limit);

    return (
        <div>
            <ul className="list-inside list-disc marker:text-primary">
                {displayItems.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            {isLong && (
                <Button
                    variant="link"
                    className="inline h-fit p-0 text-base"
                    onClick={() => setExpanded((prevState) => !prevState)}
                >
                    {expanded ? "Show less" : "Read more"}
                </Button>
            )}
        </div>
    );
};

export default ReadMoreList;
