import Link from "next/link";
import { MoveRight } from "lucide-react";

import siteConfig from "@/config/site";
import { navigationItems } from "@/lib/navigation-items";

const Footer = () => {
    return (
        <footer className="w-full bg-foreground py-20 text-background lg:py-32">
            <div className="container mx-auto">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="flex flex-col items-start gap-8">
                        <div className="flex flex-col gap-2">
                            <h2 className="max-w-xl text-left text-3xl font-semibold tracking-tighter md:text-5xl">
                                {siteConfig.name}
                            </h2>
                            <p className="max-w-lg text-left text-lg leading-relaxed tracking-tight text-background/75">
                                {siteConfig.slogan}
                            </p>
                        </div>
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} {siteConfig.name}.
                            All rights reserved.
                        </p>
                    </div>
                    <div className="grid items-start gap-10 lg:grid-cols-3">
                        {navigationItems.map((item) => (
                            <div
                                key={item.title}
                                className="flex flex-col items-start gap-1 text-base"
                            >
                                <div className="flex flex-col gap-2">
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className="group flex items-center justify-between"
                                        >
                                            <span className="text-xl">
                                                {item.title}
                                            </span>
                                            <MoveRight className="ml-2 hidden h-4 w-4 text-muted-foreground transition-opacity group-hover:block" />
                                        </Link>
                                    ) : (
                                        <p className="text-xl">{item.title}</p>
                                    )}
                                    {item.items &&
                                        item.items.map((subItem) => (
                                            <Link
                                                key={subItem.title}
                                                href={subItem.href}
                                                className="group flex items-center justify-between"
                                            >
                                                <span className="text-background/75">
                                                    {subItem.title}
                                                </span>
                                                <MoveRight className="ml-2 hidden h-4 w-4 text-muted-foreground transition-opacity group-hover:block" />
                                            </Link>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
