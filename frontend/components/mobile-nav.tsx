"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@ui/drawer";
import { navigationItems } from "@lib/navigation-items";
import MobileLink from "@comp/mobile-link";

const MobileNav = () => {
    const [open, setOpen] = React.useState(false);

    const onOpenChange = React.useCallback((open: boolean) => {
        setOpen(open);
    }, []);

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-background hover:bg-transparent hover:text-background focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
                >
                    <Menu />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[60svh] bg-foreground p-0">
                <div className="overflow-auto p-6">
                    <div className="flex flex-col space-y-2">
                        {navigationItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col space-y-3 pt-6"
                            >
                                {item.href ? (
                                    <MobileLink
                                        href={item.href}
                                        onOpenChange={setOpen}
                                        className="font-medium text-background"
                                    >
                                        {item.title}
                                    </MobileLink>
                                ) : (
                                    <h4 className="font-medium text-background">
                                        {item.title}
                                    </h4>
                                )}
                                {item?.items?.length &&
                                    item.items.map((item) => (
                                        <React.Fragment key={item.href}>
                                            {item.href ? (
                                                <MobileLink
                                                    href={item.href}
                                                    onOpenChange={setOpen}
                                                    className="text-muted-foreground"
                                                >
                                                    {item.title}
                                                </MobileLink>
                                            ) : (
                                                item.title
                                            )}
                                        </React.Fragment>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default MobileNav;
