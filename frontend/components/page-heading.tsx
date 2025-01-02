import { cn } from "@lib/utils";

const PageHeading = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn("h3 mb-8", className)}>{children}</div>;
};

export default PageHeading;
