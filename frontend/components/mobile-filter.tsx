"use client";

import { useState, useCallback, useEffect } from "react";
import { Filter } from "lucide-react";

import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@ui/drawer";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { Label } from "@ui/label";
// import MultiSelect from "@comp/multi-select";

const MobileFilter = () => {
    const [open, setOpen] = useState(false);
    const [filterBtn, setFilterBtn] = useState(false);

    // Display the filter button when user scrolls down
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            setFilterBtn(scrollTop > 200);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const onOpenChange = useCallback((open: boolean) => {
        setOpen(open);
    }, []);

    const handleApplyFilter = () => {
        setOpen(false);
    };

    const handleClearFilter = () => {
        alert("Filter cleared");
    };

    return (
        <>
            <div className="sticky top-4 flex space-x-2 lg:hidden">
                <Drawer open={open} onOpenChange={onOpenChange}>
                    <DrawerTrigger asChild>
                        <Button className="flex-1">Filters</Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[70svh] min-h-[50svh]">
                        <DrawerHeader>
                            <DrawerTitle>Filters</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4">
                            {/* <MultiSelect /> */}
                            <Label className="text-base">Genres</Label>
                            <Separator className="my-2" />
                            <Label className="text-base">Rating</Label>
                            <Separator className="my-2" />
                            <Label className="text-base">Release date</Label>
                        </div>
                        <DrawerFooter>
                            <Button onClick={handleApplyFilter}>
                                Apply filter
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleClearFilter}
                            >
                                Clear filter
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
                <Button variant="outline" className="flex-1">
                    Clear filter
                </Button>
            </div>
            {filterBtn && (
                <Button
                    className="fixed bottom-4 right-4 size-12 rounded-full lg:hidden"
                    onClick={() => setOpen(!open)}
                >
                    <Filter className="size-8" />
                    <span className="sr-only">Filter</span>
                </Button>
            )}
        </>
    );
};

export default MobileFilter;
