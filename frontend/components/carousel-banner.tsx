"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay, { AutoplayOptionsType } from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

import { cn, getTmdbImageUrl } from "@/lib/utils";
import { tmdbBackdropSizes } from "@/config/tmdb";
import { Movie } from "@/types";
import { Button } from "@ui/button";
import FancyHeading from "@comp/fancy-heading";

const CarouselBanner = ({ movies }: { movies: Movie[] }) => {
    const [emblaRef] = useEmblaCarousel({ loop: true, duration: 100 }, [
        Autoplay({ delay: 10000 }) as unknown as {
            name: string;
            options: Partial<AutoplayOptionsType>;
            init: (embla: any, OptionsHandler: any) => void;
            destroy: () => void;
        },
    ]);

    return (
        <div ref={emblaRef} className="relative overflow-hidden">
            <div className="flex">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="relative max-h-[calc(70dvh)] min-w-0 flex-[0_0_100%]"
                    >
                        <Image
                            key={movie.id}
                            src={getTmdbImageUrl(
                                tmdbBackdropSizes.original,
                                movie.backdrop_path,
                            )}
                            alt={movie.title}
                            width={1920}
                            height={1080}
                        />
                        <div
                            className={cn(
                                "inline",
                                "absolute left-0 top-0 z-20 h-full w-full space-y-5",
                                "mt-0 p-10 pt-10 xl:pt-20 2xl:pt-36",
                                "bg-transparent bg-gradient-to-r from-secondary-foreground/90 via-transparent to-transparent",
                                "text-background",
                            )}
                        >
                            <FancyHeading className="text-lg lg:text-2xl">
                                Today&apos;s trending
                            </FancyHeading>
                            <h2 className="h1">{movie.title}</h2>
                            <p className="h5 hidden max-w-xl text-base md:line-clamp-4 2xl:block">
                                {movie.overview}
                            </p>
                            <Button variant="ringHover" asChild>
                                <Link href={`/movie/${movie.id}`}>
                                    Check this out
                                </Link>
                            </Button>
                        </div>
                        <div
                            className={cn(
                                "absolute inset-0",
                                "z-10 bg-gradient-to-b from-gray-100/10 via-secondary-foreground/25 to-secondary-foreground/90",
                            )}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarouselBanner;
