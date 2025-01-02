"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@ui/pagination";
import useMediaQuery from "@hooks/use-media-query";

const PaginationControls = ({
    totalPages,
    className,
}: {
    totalPages: number;
    className?: string;
}) => {
    // State to keep track of the number of visible pages
    // Default to 10
    const [maxVisiblePages, setMaxVisiblePages] = useState(10);

    // Get the current page from the URL
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    const currentPage = parseInt(params.get("page") || "1");

    // Determine the number of visible pages based on the screen
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery(
        "(min-width: 768px) and (max-width: 1023px)",
    );
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    // Update the number of visible pages based on the screen size
    useEffect(() => {
        if (isMobile) {
            setMaxVisiblePages(3);
        } else if (isTablet) {
            setMaxVisiblePages(7);
        } else if (isDesktop) {
            setMaxVisiblePages(10);
        }
    }, [isMobile, isTablet, isDesktop]);

    // Generate the href for the pagination links
    const generateHref = (page: number) => {
        params.set("page", page.toString());
        return `?${params.toString()}`;
    };

    const generatePaginationItems = () => {
        const paginationItems = [];
        const halfVisiblePages = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(currentPage - halfVisiblePages, 1);
        let endPage = Math.min(currentPage + halfVisiblePages, totalPages);

        // Adjust the start and end page based on the current page
        if (currentPage <= halfVisiblePages) {
            endPage = Math.min(maxVisiblePages, totalPages);
        }
        if (currentPage + halfVisiblePages >= totalPages) {
            startPage = Math.max(totalPages - maxVisiblePages + 1, 1);
        }

        if (startPage > 1) {
            paginationItems.push(
                <PaginationItem key={1}>
                    <PaginationLink href={generateHref(1)}>1</PaginationLink>
                </PaginationItem>,
            );

            if (startPage > 2) {
                paginationItems.push(
                    <PaginationItem key="start-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>,
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationItems.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href={generateHref(i)}
                        isActive={i === currentPage}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationItems.push(
                    <PaginationItem key="end-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>,
                );
            }

            paginationItems.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink href={generateHref(totalPages)}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        return paginationItems;
    };

    return (
        <Pagination className={className}>
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            href={generateHref(currentPage - 1)}
                        />
                    </PaginationItem>
                )}
                {generatePaginationItems()}
                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext href={generateHref(currentPage + 1)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationControls;
