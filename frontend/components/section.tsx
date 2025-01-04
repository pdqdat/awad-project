import { cn } from "@lib/utils";
import FancyHeading from "@comp/fancy-heading";

const Section = ({
    id,
    heading,
    children,
    sectionClassName,
    containerClassName,
    href,
}: {
    id?: string;
    heading?: string | React.ReactNode;
    children: React.ReactNode;
    sectionClassName?: string;
    containerClassName?: string;
    href?: string;
}) => {
    return (
        <section id={id} className={cn("py-8", sectionClassName)}>
            <div className="container mb-4 flex items-center gap-1">
                {heading && <FancyHeading href={href}>{heading}</FancyHeading>}
            </div>
            <div className={cn("container", containerClassName)}>
                {children}
            </div>
        </section>
    );
};

export default Section;
