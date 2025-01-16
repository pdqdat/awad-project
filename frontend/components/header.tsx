import { SignUpButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

import siteConfig from "@/config/site";
import { Button } from "@ui/button";
import MobileNav from "@comp/mobile-nav";
import MainNav from "@comp/main-nav";
import SearchBox from "@comp/search-box";
import UserBtn from "@comp/user-btn";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";

const Header = async () => {
    return (
        <header className="w-full bg-foreground">
            <div className="relative mx-auto flex flex-row items-center gap-4 px-4 py-4 md:px-8 lg:grid lg:grid-cols-3 lg:px-10">
                <MainNav />
                <MobileNav />
                <div className="flex lg:justify-center">
                    <Link
                        href="/"
                        className="text-xl font-bold text-primary lg:text-2xl"
                    >
                        {siteConfig.name}
                    </Link>
                </div>
                <div className="flex w-full items-center justify-end gap-2 lg:gap-4">
                    <SearchBox whiteBg />
                    <SignedOut>
                        <HoverCard openDelay={1000} closeDelay={1000}>
                            <HoverCardTrigger>
                                <SignInButton>
                                    <Button variant="ringHover">Sign in</Button>
                                </SignInButton>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-[17rem] text-center">
                                New Customer?{" "}
                                <SignUpButton>
                                    <Button
                                        variant="linkHover2"
                                        className="px-0 text-base"
                                    >
                                        Create account
                                    </Button>
                                </SignUpButton>
                            </HoverCardContent>
                        </HoverCard>
                    </SignedOut>
                    <SignedIn>
                        <UserBtn />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
};

export default Header;
