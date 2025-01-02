"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@ui/input";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";

const SearchBox = ({
    className,
    searchBtn,
}: {
    className?: string;
    searchBtn?: boolean;
}) => {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleClick = () => {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    };

    return (
        <div
            className={cn(
                "flex w-full items-center rounded-md border border-input px-2.5",
                className,
            )}
        >
            {!searchBtn && (
                <Search
                    className="mr-2.5 h-5 w-5 cursor-pointer"
                    onClick={handleClick}
                />
            )}
            <Input
                type="search"
                placeholder="Search for a movie..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border-0 p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent"
            />
            {searchBtn && (
                <Button onClick={handleClick} className="h-7 w-7">
                    <Search className="h-5 w-5 cursor-pointer" />
                </Button>
            )}
        </div>
    );
};

export default SearchBox;
