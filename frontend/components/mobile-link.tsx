import Link, { LinkProps } from "next/link";
import { MoveRight } from "lucide-react";

import { cn } from "@lib/utils";

interface MobileLinkProps extends LinkProps {
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
}

const MobileLink = ({
    href,
    onOpenChange,
    className,
    children,
    ...props
}: MobileLinkProps) => {
    return (
        <Link
            href={href}
            onClick={() => {
                onOpenChange?.(false);
            }}
            className={cn(
                "flex items-center justify-between text-base",
                className,
            )}
            {...props}
        >
            {children}
            <MoveRight className="h-5 w-5" />
        </Link>
    );
};

export default MobileLink;
