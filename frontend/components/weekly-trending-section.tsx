import MoviesRow from "@comp/movies-row";
import { fetchTrendingMovies } from "@lib/actions";
import Section from "@comp/section";

const WeeklyTrendingSection = async () => {
    const weeklyTrendingMoviesResponse = await fetchTrendingMovies("week", 1);
    const weeklyTrendingMovies = weeklyTrendingMoviesResponse.data;

    return (
        <Section
            id="week-trending"
            sectionClassName="bg-muted py-8"
            heading="Trending this week"
        >
            {weeklyTrendingMovies ? (
                <MoviesRow movies={weeklyTrendingMovies.slice(0, 5)} />
            ) : (
                <div>Error fetching weekly trending movies</div>
            )}
        </Section>
    );
};

export default WeeklyTrendingSection;
