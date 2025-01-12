"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { ArrowRight, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/clerk-react";

import Section from "@comp/section";
import { Button } from "@ui/button";
import { Textarea } from "@ui/textarea";
import { TrendingMovie } from "@/types";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";

const AIPage = () => {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [movieResults, setMovieResults] = useState<TrendingMovie[]>([]);
    const [pageType, setPageType] = useState<"CAST_PAGE" | "MOVIE_PAGE">(
        "CAST_PAGE",
    );

    const router = useRouter();
    const { getToken } = useAuth();

    const handleClear = () => {
        setInput("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const loadingToastID = toast.loading("Processing...");

        try {
            const token = await getToken();
            if (!token) {
                toast.dismiss(loadingToastID);
                toast.error("Error submitting form: User not authenticated");
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/navigate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        query: formData.get("input"),
                    }),
                },
            );

            if (!response.ok) {
                toast.dismiss(loadingToastID);
                toast.error(`Failed to process your question`, {
                    description: "Please try again later",
                });
                return;
            }

            const data = await response.json();
            console.log(data);

            if (data.route === "NONE") {
                toast.dismiss(loadingToastID);
                toast.error("Sorry, I couldn't find anything for you");
            }

            if (data.route === "HOME_PAGE") {
                toast.dismiss(loadingToastID);
                toast.success("Redirecting you to home page");
                router.push("/");
            }

            if (data.route === "CAST_PAGE") {
                toast.dismiss(loadingToastID);
                toast.success("We found some movies for you");
                setPageType("CAST_PAGE");
                setMovieResults(data.params);
            }

            if (data.route === "MOVIE_PAGE") {
                toast.dismiss(loadingToastID);
                toast.success("We found some movies for you");
                setPageType("MOVIE_PAGE");
                setMovieResults(data.params);
            }

            if (data.route === "SEARCH_PAGE") {
                toast.dismiss(loadingToastID);
                toast("Redirecting you to search page");
                router.push(`/search?q=${data.params.keyword}`);
            }

            if (data.route === "PROFILE_PAGE") {
                toast.dismiss(loadingToastID);
                toast("Redirecting you to your profile page");
                router.push(`/profile`);
            }

            handleClear();
        } catch (error) {
            toast.dismiss(loadingToastID);
            console.error("Error submitting form:", error);
            toast.error(`${error}`);

            handleClear();
        }
    };

    return (
        <>
            <Section sectionClassName="bg-secondary-foreground">
                <div className="mx-auto flex flex-col items-center justify-center">
                    <div className="mb-8 w-full max-w-2xl px-6 text-background">
                        <h4 className="h4">Ask our AI simple questions</h4>
                        <blockquote className="mt-2 border-l-2 pl-4 italic">
                            E.g. &quot;Cast of Joker&quot;, &quot;How does my
                            profile look like?&quot;, or just &quot;Fast &
                            Furious&quot;
                        </blockquote>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-2xl px-6"
                    >
                        <div className="relative flex w-full items-center">
                            <Textarea
                                ref={inputRef}
                                name="input"
                                rows={1}
                                tabIndex={0}
                                placeholder="Ask a question..."
                                spellCheck={false}
                                value={input}
                                className="min-h-12 w-full resize-none rounded-md border border-input bg-muted pb-1 pl-4 pr-10 pt-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={(e) => {
                                    setInput(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    // Enter should submit the form, but disable it right after IME input confirmation
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        // Prevent the default action to avoid adding a new line
                                        if (input.trim().length === 0) {
                                            e.preventDefault();
                                            return;
                                        }
                                        e.preventDefault();
                                        const textarea =
                                            e.target as HTMLTextAreaElement;
                                        textarea.form?.requestSubmit();
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                variant="default"
                                className="absolute right-2 top-1/2 -translate-y-1/2 transform"
                                disabled={input.length === 0}
                            >
                                <ArrowRight size={20} />
                            </Button>
                        </div>
                    </form>
                </div>
            </Section>
            <Section sectionClassName="min-h-[calc(75vh)]">
                {movieResults.length === 0 && ""}
                {movieResults.length > 0 && (
                    <>
                        <div className="h4 mb-4">
                            We found some movies for you
                        </div>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {movieResults.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="flex flex-col overflow-hidden rounded-xl shadow-lg transition-shadow hover:shadow-xl"
                                >
                                    <Link
                                        href={`/movie/${movie.id}`}
                                        target="_blank"
                                    >
                                        <Image
                                            src={
                                                movie.poster_path
                                                    ? getTmdbImageUrl(
                                                          tmdbPosterSizes.w342,
                                                          movie.poster_path,
                                                      )
                                                    : "/img-placeholder.webp"
                                            }
                                            alt={movie.title}
                                            width={342}
                                            height={513}
                                            loading="lazy"
                                            className="aspect-[3/4] h-auto w-auto object-cover transition-all hover:brightness-90"
                                        />
                                    </Link>
                                    <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                                        <div className="font-medium">
                                            {movie.title}{" "}
                                            {movie.release_date &&
                                            !isNaN(
                                                new Date(
                                                    movie.release_date,
                                                ).getFullYear(),
                                            ) ? (
                                                <span className="font-normal text-muted-foreground">
                                                    (
                                                    {new Date(
                                                        movie.release_date,
                                                    ).getFullYear()}
                                                    )
                                                </span>
                                            ) : null}
                                        </div>
                                        <Button asChild className="w-full">
                                            <Link
                                                href={
                                                    pageType === "CAST_PAGE"
                                                        ? `/movie/${movie.id}/cast`
                                                        : `/movie/${movie.id}`
                                                }
                                                target="_blank"
                                            >
                                                {pageType === "CAST_PAGE"
                                                    ? "View all casts"
                                                    : "View movie"}
                                                <SquareArrowOutUpRight />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Section>
        </>
    );
};

export default AIPage;
