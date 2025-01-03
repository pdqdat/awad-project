import { cn } from "@lib/utils";
import FancyHeading from "@comp/fancy-heading";

const Section = ({
    id,
    heading,
    children,
    className,
}: {
    id?: string;
    heading?: string;
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <section className={cn("py-8", className)} id={id}>
            <div className="container">
                {heading && <FancyHeading>{heading}</FancyHeading>}
                {children}
            </div>
        </section>
    );
};

export default Section;
