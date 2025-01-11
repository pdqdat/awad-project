import TrendingSection from "@comp/trending-section";
import SearchSection from "@comp/search-section";
import TrailerSection from "@comp/trailer-section";
import PopularSection from "@comp/popular-section";

const HomePage = () => {
    return (
        <>
            <TrailerSection />
            <SearchSection />
            <TrendingSection />
            <PopularSection />
        </>
    );
};

export default HomePage;
