import MoviesRow from "@comp/movies-row";
import { fetchTrendingMovies } from "@lib/actions";
import FancyHeading from "@comp/fancy-heading";
import { Separator } from "@ui/separator";

const TrendingSection = async () => {
    const weeklyTrendingMoviesResponse = await fetchTrendingMovies("week", 1);
    const weeklyTrendingMovies = weeklyTrendingMoviesResponse.data;

    const dailyTrendingMoviesResponse = await fetchTrendingMovies("day", 1);
    const dailyTrendingMovies = dailyTrendingMoviesResponse.data;

    return (
        <div className="bg-muted py-8">
            <div className="container">
                <h3 className="h2 mb-4 font-semibold text-primary">
                    Trending Movies
                </h3>
                <FancyHeading>Today</FancyHeading>
                {dailyTrendingMovies ? (
                    <MoviesRow movies={dailyTrendingMovies.slice(0, 5)} />
                ) : (
                    <p>Error fetching daily trending movies</p>
                )}
                <Separator className="my-4" />
                <FancyHeading>This week</FancyHeading>
                {weeklyTrendingMovies ? (
                    <MoviesRow movies={weeklyTrendingMovies.slice(0, 5)} />
                ) : (
                    <p>Error fetching weekly trending movies</p>
                )}
            </div>
        </div>
    );
};

export default TrendingSection;
