"use client";

import { useState, useRef, useCallback, KeyboardEvent, useEffect } from "react";
import { X } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { useSearchParams } from "next/navigation";

import { Badge } from "@ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@ui/command";
import { ScrollArea } from "@ui/scroll-area";
import { TmdbGenre } from "@/types";
import { genres } from "@/config/movie";

const MultiSelect = ({
    onSelectionChange,
}: {
    onSelectionChange: (selected: string[]) => void;
}) => {
    // Get the genre params from the URL
    const searchParams = useSearchParams();
    const genreParams = searchParams.getAll("genre") || [];

    // Initialize the selected genres with the genres from the URL
    const initialSelectedGenres = genreParams.length
        ? genres.filter((genre) => genreParams.includes(genre.value))
        : [];

    // State to store the selected genres with default values from the URL
    // If there are no genres in the URL, the default value is an empty array
    const [selected, setSelected] = useState<TmdbGenre[]>(
        initialSelectedGenres,
    );

    // State to store the open state of the drawer
    const [open, setOpen] = useState(false);
    // A ref to the input field
    const inputRef = useRef<HTMLInputElement>(null);
    // State to store the input value
    const [inputValue, setInputValue] = useState("");

    const handleUnselect = useCallback((genre: TmdbGenre) => {
        // Remove the genre from the selected genres
        setSelected((prev) => prev.filter((s) => s.value !== genre.value));
    }, []);

    // Handle the keydown event on the input field to remove the last selected genre when the input is empty
    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
            // Handle the Backspace and Delete key events
            // to remove the last selected genre when the input is empty
            if (e.key === "Delete" || e.key === "Backspace") {
                if (input.value === "") {
                    setSelected((prev) => {
                        const newSelected = [...prev];
                        newSelected.pop();
                        return newSelected;
                    });
                }
            }

            // Handle the Escape key event to blur the input field
            // This is not a default behavior of the <input /> field
            if (e.key === "Escape") {
                input.blur();
            }
        }
    }, []);

    // Filter the genres that are not selected
    const selectables = genres.filter((genre) => !selected.includes(genre));

    // Call the onSelectionChange function to send data
    // to the `MainFilter` parent when the selected genres change
    useEffect(() => {
        onSelectionChange(selected.map((genre) => genre.value));
    }, [selected, onSelectionChange]);

    // Update the selected genres when the URL changes
    useEffect(() => {
        const genreParams = searchParams.getAll("genre") || [];
        const updatedSelectedGenres = genreParams.length
            ? genres.filter((genre) => genreParams.includes(genre.value))
            : [];
        setSelected(updatedSelectedGenres);
    }, [searchParams]);

    return (
        <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
        >
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {selected.map((genre) => {
                        return (
                            <Badge
                                key={genre.value}
                                variant="secondary"
                                className="text-sm"
                            >
                                {genre.name}
                                <button
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(genre);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(genre)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        );
                    })}
                    {/* Avoid having the "Search" Icon */}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder="Select genre..."
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                <CommandList>
                    {open && selectables.length > 0 ? (
                        <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-full overflow-auto">
                                <ScrollArea className="h-72">
                                    {selectables.map((genre) => {
                                        return (
                                            <CommandItem
                                                key={genre.value}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onSelect={() => {
                                                    setInputValue("");
                                                    setSelected((prev) => [
                                                        ...prev,
                                                        genre,
                                                    ]);
                                                }}
                                                className={"cursor-pointer"}
                                            >
                                                {genre.name}
                                            </CommandItem>
                                        );
                                    })}{" "}
                                </ScrollArea>
                            </CommandGroup>
                        </div>
                    ) : null}
                </CommandList>
            </div>
        </Command>
    );
};

export default MultiSelect;
