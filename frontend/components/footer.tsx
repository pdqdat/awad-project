import Link from "next/link";
import { MoveRight, Facebook, Instagram, Github } from "lucide-react";

import siteConfig from "@/config/site";
import { navigationItems } from "@lib/navigation-items";
import { Button } from "@ui/button";

const Footer = () => {
    return (
        <footer className="w-full bg-foreground py-20 text-background lg:py-28">
            <div className="container mx-auto">
                <div className="grid items-start gap-10 lg:grid-cols-2">
                    <div className="flex flex-col items-start gap-8">
                        <div className="flex flex-col gap-2">
                            <div className="max-w-xl text-left text-3xl font-semibold tracking-tighter text-primary md:text-5xl">
                                <Link
                                    href="/"
                                    className="max-w-xl text-left text-3xl font-semibold tracking-tighter text-primary md:text-5xl"
                                >
                                    {siteConfig.name}
                                </Link>
                            </div>
                            <p className="h4 font-medium text-accent">
                                {siteConfig.slogan}
                            </p>
                            <div className="mt-4 flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    className="rounded-full bg-transparent text-background"
                                    size="icon"
                                    asChild
                                >
                                    <Link
                                        href="https://www.facebook.com/profile.php?id=100011347858353"
                                        target="_blank"
                                    >
                                        <Facebook />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-full bg-transparent text-background"
                                    size="icon"
                                    asChild
                                >
                                    <Link
                                        href="https://www.instagram.com/datttphan/"
                                        target="_blank"
                                    >
                                        <Instagram />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-full bg-transparent text-background"
                                    size="icon"
                                    asChild
                                >
                                    <Link
                                        href="https://github.com/pdqdat/awad-project"
                                        target="_blank"
                                    >
                                        <Github />
                                    </Link>
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant="linkHover2"
                                    className="px-0 text-base font-medium leading-none"
                                    asChild
                                >
                                    <Link href="mailto:phanduongquocdat273@gmail.com">
                                        Contact us via email
                                    </Link>
                                </Button>
                            </div>
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
                                            <span className="h4">
                                                {item.title}
                                            </span>
                                            <MoveRight className="ml-2 hidden h-4 w-4 text-muted-foreground transition-opacity group-hover:block" />
                                        </Link>
                                    ) : (
                                        <div className="h4">{item.title}</div>
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
