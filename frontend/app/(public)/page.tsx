import TrendingMoviesSection from "@comp/trending-movies-section";
import SearchSection from "@comp/search-section";
import TrailerSection from "@comp/trailer-section";
import PopularMoviesSection from "@/components/Popular-movies-section";

const HomePage = () => {
    return (
        <>
            <SearchSection />
            <TrailerSection />
            <TrendingMoviesSection />
            <PopularMoviesSection />
        </>
    );
};

export default HomePage;
