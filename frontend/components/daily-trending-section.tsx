import { fetchTrendingMovies } from "@lib/actions";
import CarouselBanner from "@comp/carousel-banner";

const DailyTrendingSection = async () => {
    const dailyTrendingMoviesResponse = await fetchTrendingMovies("day", 1);
    const dailyTrendingMovies = dailyTrendingMoviesResponse.data;

    if (!dailyTrendingMovies.length) {
        return <div>Error fetching daily trending movies</div>;
    }

    return <CarouselBanner movies={dailyTrendingMovies.slice(10)} />;
};

export default DailyTrendingSection;
