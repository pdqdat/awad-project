"use client";

import { useState } from "react";

function ReadMoreList({ items, limit = 5 }: { items: string[]; limit?: number }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = items.length > limit;
    const displayItems = expanded ? items : items.slice(0, limit);

    return (
        <div>
            <ul className="list-inside list-disc">
                {displayItems.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            {isLong && (
                <button style={{ display: "inline", marginLeft: "10px", color: "gray", textDecoration: "underline" }} onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Show Less" : "Read More"}
                </button>
            )}
        </div>
    );
}

export default ReadMoreList;