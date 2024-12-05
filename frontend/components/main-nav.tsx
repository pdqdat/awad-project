import Link from "next/link";
import { MoveRight } from "lucide-react";
import {
    SignInButton,
    SignedOut,
} from "@clerk/nextjs";

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

const MainNav = () => {
    return (
        <div className="hidden flex-row items-center justify-start gap-4 lg:flex">
            <NavigationMenu className="flex items-start justify-start">
                <NavigationMenuList className="flex flex-row justify-start gap-4">
                    {navigationItems.map((item) => (
                        <NavigationMenuItem key={item.title}>
                            {item.href ? (
                                <Link href={item.href} legacyBehavior passHref>
                                    <NavigationMenuLink
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        {item.title}
                                    </NavigationMenuLink>
                                </Link>
                            ) : (
                                <>
                                    <NavigationMenuTrigger className="text-sm font-medium">
                                        {item.title}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="!w-[450px] p-4">
                                        <div className="flex grid-cols-2 flex-col gap-4 lg:grid">
                                            <div className="flex h-full flex-col justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-base font-semibold">
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
                                                        className="flex flex-row items-center justify-between rounded px-4 py-2 hover:bg-muted"
                                                    >
                                                        <span>
                                                            {subItem.title}
                                                        </span>
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
        </div>
    );
};

export default MainNav;
