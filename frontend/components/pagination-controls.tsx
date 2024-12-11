/**
 * @file pagination-controls.tsx
 * @description This file contains the `PaginationControls` component, which is responsible for rendering pagination controls for navigating through pages of content.
 *
 * The component uses the Pagination component from Shadcn/UI  to create a pagination interface that includes previous and next buttons, as well as individual page links.
 * It dynamically generates pagination items based on the current page and total number of pages, ensuring that a maximum of 10 pages are visible at a time.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {number} props.currentPage - The current active page number.
 * @param {number} props.totalPages - The total number of pages available.
 * @param {string | string[]} props.query - The query string used for generating page links.
 *
 * @returns {JSX.Element} The rendered pagination controls component.
 */
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@ui/pagination";

const MAX_VISIBLE_PAGES = 10;

const PaginationControls = ({
    currentPage,
    totalPages,
    query,
    className,
}: {
    currentPage: number;
    totalPages: number;
    query: string | string[];
    className?: string;
}) => {
    const generatePaginationItems = () => {
        const paginationItems = [];
        const halfVisiblePages = Math.floor(MAX_VISIBLE_PAGES / 2);

        let startPage = Math.max(currentPage - halfVisiblePages, 1);
        let endPage = Math.min(currentPage + halfVisiblePages, totalPages);

        if (currentPage <= halfVisiblePages) {
            endPage = Math.min(MAX_VISIBLE_PAGES, totalPages);
        }

        if (currentPage + halfVisiblePages >= totalPages) {
            startPage = Math.max(totalPages - MAX_VISIBLE_PAGES + 1, 1);
        }

        if (startPage > 1) {
            paginationItems.push(
                <PaginationItem key={1}>
                    <PaginationLink href={`?q=${query}&page=1`}>
                        1
                    </PaginationLink>
                </PaginationItem>,
            );
            if (startPage > 2) {
                paginationItems.push(<span key="start-ellipsis">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationItems.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href={`?q=${query}&page=${i}`}
                        isActive={i === currentPage}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationItems.push(<span key="end-ellipsis">...</span>);
            }
            paginationItems.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink href={`?q=${query}&page=${totalPages}`}>
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
                            href={`?q=${query}&page=${currentPage - 1}`}
                        />
                    </PaginationItem>
                )}
                {generatePaginationItems()}
                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext
                            href={`?q=${query}&page=${currentPage + 1}`}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationControls;
