import Image from "next/image";
import Link from "next/link";

import { CastDetail } from "@/types";
import { tmdbPosterSizes, getTmdbImageUrl } from "@/config/tmdb";

interface CastCardProps {
    cast: CastDetail;
}

const CastCard = ({ cast }: CastCardProps) => {
    return (
        <div className="space-y-2">
            <Link href={`/cast/${cast.id}`}>
                <div className="overflow-hidden rounded-md">
                    <Image
                        src={getTmdbImageUrl(
                            tmdbPosterSizes.w342,
                            cast.profile_path,
                        )}
                        alt={cast.original_name}
                        width={342}
                        height={513}
                        loading="lazy"
                        className="aspect-[3/4] h-auto w-auto object-cover transition-all hover:scale-105"
                    />
                </div>
            </Link>
            <div className="space-y-1">
                <h3 className="font-medium leading-none">{cast.original_name}</h3>
                <p className="text-sm text-muted-foreground">
                    {(cast.character)}
                </p>
            </div>
        </div>
    );
};

export default CastCard;
