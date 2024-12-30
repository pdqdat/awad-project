import { CastDetail } from "@/types";
import CastCard from "@comp/cast-card";

const CastRow = ({ casts }: { casts: CastDetail[] }) => {
    return (
        <div className="my-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {casts.map((cast) => (
                <CastCard cast={cast} key={cast.id} />
            ))}
        </div>
    );
};

export default CastRow;
