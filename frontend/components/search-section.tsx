import SearchBox from "@comp/search-box";
import siteConfig from "@/config/site";
import Section from "@comp/section";

const SearchSection = () => {
    return (
        <Section
            id="search"
            sectionClassName="pt-4 pb-16 bg-secondary-foreground text-background"
        >
            <h1 className="h1">Welcome to {siteConfig.name}</h1>
            <h4 className="h4">{siteConfig.slogan}</h4>
            <SearchBox className="mt-8 text-foreground" searchBtn whiteBg />
        </Section>
    );
};

export default SearchSection;
