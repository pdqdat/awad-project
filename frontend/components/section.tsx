import { cn } from "@lib/utils";
import FancyHeading from "@comp/fancy-heading";

const Section = ({
    id,
    heading,
    children,
    sectionClassName,
    containerClassName,
}: {
    id?: string;
    heading?: string;
    children: React.ReactNode;
    sectionClassName?: string;
    containerClassName?: string;
}) => {
    return (
        <section className={cn("py-8", sectionClassName)} id={id}>
            <div className="container">
                {heading && <FancyHeading>{heading}</FancyHeading>}
            </div>
            <div className={cn("container", containerClassName)}>
                {children}
            </div>
        </section>
    );
};

export default Section;
