"use client";

import { useState } from "react";

import { Button } from "@ui/button";

const ReadMore = ({ text, limit = 250 }: { text: string; limit?: number }) => {
    const [expanded, setExpanded] = useState(false);

    const isLong = text.length > limit;
    const displayText = expanded
        ? text
        : text.slice(0, limit) + (isLong ? "..." : "");

    return (
        <div>
            <p className="inline">{displayText}</p>
            {isLong && (
                <Button
                    variant="link"
                    className="ml-2 inline h-fit p-0 text-base"
                    onClick={() => setExpanded((prevState) => !prevState)}
                >
                    {expanded ? "Show less" : "Read more"}
                </Button>
            )}
        </div>
    );
};

export default ReadMore;
