import Link from "next/link";

import { CastInCredit } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { tmdbPosterSizes } from "@/config/tmdb";
import { getTmdbImageUrl } from "@lib/utils";
import { Button } from "@ui/button";

const CastRow = ({ casts }: { casts: CastInCredit[] }) => {
    return (
        <div className="my-4 grid grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {casts.map((cast) => (
                <div key={cast.id} className="flex flex-col items-center">
                    <Link href={`/cast/${cast.id}`}>
                        <Avatar className="size-40">
                            <AvatarImage
                                src={getTmdbImageUrl(
                                    tmdbPosterSizes.w342,
                                    cast.profile_path ?? "",
                                )}
                                alt={cast.original_name}
                                className="object-cover transition-all hover:scale-105"
                            />
                            <AvatarFallback className="text-sm">
                                {cast.name}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <Button
                        variant="linkHover2"
                        className="mt-2 text-base"
                        asChild
                    >
                        <Link href={`/cast/${cast.id}`}>
                            <div className="font-medium leading-none">
                                {cast.original_name}
                            </div>
                        </Link>
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        {cast.character}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default CastRow;
