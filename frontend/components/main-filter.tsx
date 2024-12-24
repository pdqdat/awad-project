"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@ui/card";
import { Button } from "@ui/button";
import MultiSelect from "@comp/multi-select";
import { Separator } from "@ui/separator";

const MainFilter = () => {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [clearSelection, setClearSelection] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleApplyFilter = () => {
        const params = new URLSearchParams();
        const q = searchParams.get("q");
        if (q) {
            params.append("q", q);
        }
        selectedGenres.forEach((genre) => params.append("genre", genre));
        router.replace(`?${params.toString()}`);
    };

    const handleClearFilter = () => {
        const params = new URLSearchParams();
        const q = searchParams.get("q");
        if (q) {
            params.append("q", q);
        }
        router.replace(`?${params.toString()}`);
        setSelectedGenres([]);
        setClearSelection(true);
    };

    return (
        <Card className="hidden lg:sticky lg:top-4 lg:block">
            <CardHeader>
                <CardTitle>Filter</CardTitle>
            </CardHeader>
            <CardContent>
                <MultiSelect
                    onSelectionChange={setSelectedGenres}
                    clearSelection={clearSelection}
                />
                <Separator className="my-2" />
                Rating
                <Separator className="my-2" />
                Release date
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button
                    className="w-full"
                    disabled={selectedGenres.length === 0}
                    onClick={handleApplyFilter}
                >
                    Apply filter
                </Button>
                {selectedGenres.length > 0 && (
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
