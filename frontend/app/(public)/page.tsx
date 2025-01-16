import WeeklyTrendingSection from "@comp/weekly-trending-section";
import SearchSection from "@comp/search-section";
import TrailerSection from "@comp/trailer-section";
import PopularSection from "@comp/popular-section";
import DailyTrendingSection from "@comp/daily-trending-section";

const HomePage = () => {
    return (
        <>
            <DailyTrendingSection />
            <SearchSection />
            <WeeklyTrendingSection />
            <TrailerSection />
            <PopularSection />
        </>
    );
};

export default HomePage;
