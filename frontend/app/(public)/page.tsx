import TrendingSection from "@comp/trending-section";
import SearchSection from "@comp/search-section";
import TrailerSection from "@comp/trailer-section";
import PopularMoviesSection from "@/components/Popular-movies-section";

const HomePage = () => {
    return (
        <>
            <TrailerSection />
            <SearchSection />
            <TrendingSection />
            <PopularMoviesSection />
        </>
    );
};

export default HomePage;
