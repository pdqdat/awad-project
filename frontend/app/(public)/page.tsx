import TrendingMoviesSection from "@comp/trending-movies-section";
import SearchSection from "@comp/search-section";
import TrailerSection from "@comp/trailer-section";

const HomePage = () => {
    return (
        <>
            <SearchSection />
            <TrailerSection />
            <TrendingMoviesSection />
        </>
    );
};

export default HomePage;
