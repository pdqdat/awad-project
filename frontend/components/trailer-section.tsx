import Link from "next/link";

import Section from "@comp/section";
import { Card, CardContent } from "@ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@ui/carousel";
import { fetchUpcomingMovies } from "@lib/actions";

const TrailerSection = async () => {
    const response = await fetchUpcomingMovies();

    if (!response || !response.data) {
        return <div>Error fetching trailers</div>;
    }
    const { data: movies } = response;

    if (!movies.length) {
        return <div>No trailers available</div>;
    }

    return (
        <Section
            id="trailers"
            heading="Latest trailers"
            containerClassName="flex justify-center"
        >
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full max-w-5xl"
            >
                <CarouselContent>
                    {movies.map((movie) => (
                        <CarouselItem key={movie.trailers[0].id}>
                            <div className="text-center">
                                <Card className="overflow-hidden">
                                    <CardContent className="relative aspect-video min-h-fit">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${movie.trailers[0].key}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute left-0 top-0 h-full w-full"
                                        />
                                    </CardContent>
                                </Card>
                                <Link
                                    href={`/movie/${movie.id}`}
                                    className="h5 font-bold transition-colors hover:text-primary"
                                >
                                    {movie.title}
                                </Link>
                                <div>{movie.tagline}</div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 top-full" />
                <CarouselNext className="right-0 top-full" />
            </Carousel>
        </Section>
    );
};

export default TrailerSection;
