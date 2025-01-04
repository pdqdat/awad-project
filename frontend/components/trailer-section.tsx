import Section from "@comp/section";
import { Card, CardContent } from "@ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@ui/carousel";

const TrailerSection = () => {
    return (
        <Section
            sectionClassName="bg-secondary-foreground"
            containerClassName="flex justify-center"
        >
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full max-w-3xl"
            >
                <CarouselContent>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-video items-center justify-center p-6">
                                        <span className="text-3xl font-semibold">
                                            Trailer #{index + 1}
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </Section>
    );
};

export default TrailerSection;
