import { cn } from "@lib/utils";

interface FancyHeadingProps {
    children: React.ReactNode;
    className?: string;
}

const FancyHeading = ({ children, className }: FancyHeadingProps) => {
    return (
        <div className="mb-4 flex">
            <div className="mr-2 rounded-md border-r-[3px] border-primary"></div>
            <p className={cn("h6 font-semibold", className)}>{children}</p>
        </div>
    );
};

export default FancyHeading;
