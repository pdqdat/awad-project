"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { useSearchParams } from "next/navigation";

import { Badge } from "@ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@ui/command";
import { ScrollArea } from "@ui/scroll-area";
import { TmdbGenre } from "@/types";

const genres = [
    {
        id: 28,
        name: "Action",
        value: "action",
    },
    {
        id: 12,
        name: "Adventure",
        value: "adventure",
    },
    {
        id: 16,
        name: "Animation",
        value: "animation",
    },
    {
        id: 35,
        name: "Comedy",
        value: "comedy",
    },
    {
        id: 80,
        name: "Crime",
        value: "crime",
    },
    {
        id: 99,
        name: "Documentary",
        value: "documentary",
    },
    {
        id: 18,
        name: "Drama",
        value: "drama",
    },
    {
        id: 10751,
        name: "Family",
        value: "family",
    },
    {
        id: 14,
        name: "Fantasy",
        value: "fantasy",
    },
    {
        id: 36,
        name: "History",
        value: "history",
    },
    {
        id: 27,
        name: "Horror",
        value: "horror",
    },
    {
        id: 10402,
        name: "Music",
        value: "music",
    },
    {
        id: 9648,
        name: "Mystery",
        value: "mystery",
    },
    {
        id: 10749,
        name: "Romance",
        value: "romance",
    },
    {
        id: 878,
        name: "Science Fiction",
        value: "science+fiction",
    },
    {
        id: 10770,
        name: "TV Movie",
        value: "tv+movie",
    },
    {
        id: 53,
        name: "Thriller",
        value: "thriller",
    },
    {
        id: 10752,
        name: "War",
        value: "war",
    },
    {
        id: 37,
        name: "Western",
        value: "western",
    },
];

const MultiSelect = ({
    onSelectionChange,
    clearSelection,
}: {
    onSelectionChange: (selected: string[]) => void;
    clearSelection: boolean;
}) => {
    const searchParams = useSearchParams();
    const genreParams = searchParams.getAll("genre") || [];

    const initialSelectedGenres = genreParams.length
        ? genres.filter((genre) => genreParams.includes(genre.value))
        : [];

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<TmdbGenre[]>(
        initialSelectedGenres,
    );
    const [inputValue, setInputValue] = React.useState("");

    const handleUnselect = React.useCallback((genre: TmdbGenre) => {
        setSelected((prev) => prev.filter((s) => s.value !== genre.value));
    }, []);

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (input) {
                if (e.key === "Delete" || e.key === "Backspace") {
                    if (input.value === "") {
                        setSelected((prev) => {
                            const newSelected = [...prev];
                            newSelected.pop();
                            return newSelected;
                        });
                    }
                }

                // This is not a default behavior of the <input /> field
                if (e.key === "Escape") {
                    input.blur();
                }
            }
        },
        [],
    );

    const selectables = genres.filter((genre) => !selected.includes(genre));

    React.useEffect(() => {
        onSelectionChange(selected.map((genre) => genre.value));
    }, [selected, onSelectionChange]);

    React.useEffect(() => {
        if (clearSelection) {
            setSelected([]);
        }
    }, [clearSelection]);

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
