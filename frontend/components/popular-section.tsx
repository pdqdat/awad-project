import MoviesRow from "@comp/movies-row";
import { fetchPopularMovies } from "@lib/actions";
import Section from "@comp/section";

const PopularSection = async () => {
    const { data: movies } = await fetchPopularMovies(
        1,
        "", // genre
        "0", // minRating
        "10", // maxRating
        "", // from
        "", // to
    );

    return (
        <Section
            id="popular"
            sectionClassName="bg-muted py-8"
            heading="What's popular"
            href="/popular"
        >
            {movies ? (
                <MoviesRow movies={movies.slice(0, 10)} />
            ) : (
                <p>Error fetching popular movies</p>
            )}
        </Section>
    );
};

export default PopularSection;
