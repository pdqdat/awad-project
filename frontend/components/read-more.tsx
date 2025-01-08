"use client";

import { useState } from "react";

function ReadMore({ text, limit = 250 }: { text: string; limit?: number }) {
    "use client";
    const [expanded, setExpanded] = useState(false);
    const isLong = text.length > limit;
    const displayText = expanded ? text : text.slice(0, limit) + (isLong ? "..." : "");

    return (
        <div>
            <p style={{ display: "inline" }}>{displayText}</p>
            {isLong && (
            <button style={{ display: "inline", marginLeft: "10px", color: "gray", textDecoration: "underline" }} onClick={() => setExpanded(!expanded)}>
                {expanded ? "Show Less" : "Read More"}
            </button>
            )}
        </div>
    );
}

export default ReadMore;