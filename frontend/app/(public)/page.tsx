import TrendingSection from "@comp/trending-section";
import SearchSection from "@comp/search-section";
import TrailerSection from "@comp/trailer-section";

const HomePage = () => {
    return (
        <>
            <TrailerSection />
            <SearchSection />
            <TrendingSection />
        </>
    );
};

export default HomePage;
