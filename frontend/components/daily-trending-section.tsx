import { fetchTrendingMovies } from "@lib/actions";
import CarouselBanner from "@comp/carousel-banner";

const DailyTrendingSection = async () => {
    const dailyTrendingMoviesResponse = await fetchTrendingMovies("day", 1);
    const dailyTrendingMovies = dailyTrendingMoviesResponse.data;

    if (!dailyTrendingMovies.length) {
        return <div>Error fetching daily trending movies</div>;
    }

    // Display the first 20 trending movies
    return <CarouselBanner movies={dailyTrendingMovies.slice(0, 20)} />;
};

export default DailyTrendingSection;
