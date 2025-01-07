import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@lib/utils";

const FancyHeading = ({
    children,
    className,
    href,
}: {
    children: React.ReactNode;
    className?: string;
    href?: string;
}) => {
    const content = (
        <div className="group flex">
            <div className="mr-2 rounded-md border-r-[4px] border-primary" />
            <div className="flex items-center">
                <h3 className={cn("h3 tracking-normal", className)}>
                    {children}
                </h3>
                {href && (
                    <ChevronRight className="size-9 stroke-[2.25px] transition-all group-hover:translate-x-1 group-hover:text-primary" />
                )}
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
};

export default FancyHeading;
