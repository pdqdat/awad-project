import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

import siteConfig from "@/config/site";
import { Button } from "@ui/button";
import MobileNav from "@comp/mobile-nav";
import MainNav from "@comp/main-nav";
import SearchBox from "@comp/search-box";
import UserBtn from "@comp/user-btn";

const Header = async () => {
    return (
        <header className="w-full bg-foreground">
            <div className="container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3">
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
                        <SignInButton>
                            <Button variant="ringHover">Sign in</Button>
                        </SignInButton>
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
