import Link from "next/link";
import { MoveRight } from "lucide-react";
import { SignInButton, SignedOut } from "@clerk/nextjs";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@ui/navigation-menu";
import { navigationItems } from "@lib/navigation-items";
import { Button } from "@ui/button";
import { cn } from "@lib/utils";

const MainNav = () => {
    return (
        <NavigationMenu className="hidden items-start justify-start lg:flex">
            <NavigationMenuList className="flex flex-row justify-start gap-2">
                {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                        {item.href ? (
                            <Link href={item.href} legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        "text-base",
                                    )}
                                >
                                    {item.title}
                                </NavigationMenuLink>
                            </Link>
                        ) : (
                            <>
                                <NavigationMenuTrigger className="text-base font-medium">
                                    {item.title}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="!w-[450px] bg-foreground p-4 text-background">
                                    <div className="flex grid-cols-2 flex-col gap-4 lg:grid">
                                        <div className="flex h-full flex-col justify-between">
                                            <div className="flex flex-col">
                                                <p className="text-lg font-semibold">
                                                    {item.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <SignedOut>
                                                <SignInButton>
                                                    <Button
                                                        size="sm"
                                                        className="mt-10"
                                                    >
                                                        Join us today
                                                    </Button>
                                                </SignInButton>
                                            </SignedOut>
                                        </div>
                                        <div className="flex h-full flex-col justify-end text-sm">
                                            {item.items?.map((subItem) => (
                                                <NavigationMenuLink
                                                    href={subItem.href}
                                                    key={subItem.title}
                                                    className="flex flex-row items-center justify-between rounded px-4 py-2 hover:bg-secondary-foreground"
                                                >
                                                    <span>{subItem.title}</span>
                                                    <MoveRight className="h-4 w-4 text-muted-foreground" />
                                                </NavigationMenuLink>
                                            ))}
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </>
                        )}
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default MainNav;
