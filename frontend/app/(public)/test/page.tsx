"use client";

import useMediaQuery from "@hooks/use-media-query";

const TestPage = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery(
        "(min-width: 768px) and (max-width: 1023px)",
    );
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    return (
        <div className="container">
            <h1>Test Page</h1>
            {isMobile && <p>Mobile</p>}
            {isTablet && <p>Tablet</p>}
            {isDesktop && <p>Desktop</p>}
        </div>
    );
};

export default TestPage;
