import MoviesRow from "@comp/movies-row";
import { fetchTrendingMovies } from "@lib/actions";

const TrendingMoviesSection = async () => {
    const weeklyTrendingMoviesResponse = await fetchTrendingMovies("week", 1);
    const weeklyTrendingMovies = weeklyTrendingMoviesResponse.results;

    const dailyTrendingMoviesResponse = await fetchTrendingMovies("day", 1);
    const dailyTrendingMovies = dailyTrendingMoviesResponse.results;

    return (
        <div className="bg-muted py-8">
            <div className="container">
                <h2 className="mb-4 text-2xl font-semibold text-primary">
                    Trending Movies
                </h2>
                <h4>This week</h4>
                {weeklyTrendingMovies ? (
                    <MoviesRow movies={weeklyTrendingMovies.slice(0, 5)} />
                ) : (
                    <p>Error fetching weekly trending movies</p>
                )}
                <h4>Today</h4>
                {dailyTrendingMovies ? (
                    <MoviesRow movies={dailyTrendingMovies.slice(0, 5)} />
                ) : (
                    <p>Error fetching daily trending movies</p>
                )}
            </div>
        </div>
    );
};

export default TrendingMoviesSection;
