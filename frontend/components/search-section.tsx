import SearchBox from "@comp/search-box";
import siteConfig from "@/config/site";

const SearchSection = () => {
    return (
        <div className="py-16">
            <div className="container">
                <h1 className="h1">Welcome to {siteConfig.name}</h1>
                <h4 className="h4">{siteConfig.slogan}</h4>
                <SearchBox className="mt-8" searchBtn />
            </div>
        </div>
    );
};

export default SearchSection;
