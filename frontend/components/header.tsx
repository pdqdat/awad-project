import {
    UserButton,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";

import siteConfig from "@/config/site";
import { Button } from "@ui/button";
import MobileNav from "@comp/mobile-nav";
import MainNav from "@comp/main-nav";
import SearchBox from "@comp/search-box";

const Header = async () => {
    return (
        <header className="w-full bg-background">
            <div className="container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3">
                <MainNav />
                <MobileNav />
                <div className="flex lg:justify-center">
                    <Link href="/" className="text-xl font-bold lg:text-2xl">
                        {siteConfig.name}
                    </Link>
                </div>
                <div className="flex w-full justify-end gap-4">
                    <SearchBox />
                    <SignedOut>
                        <SignInButton>
                            <Button variant="outline">Sign in</Button>
                        </SignInButton>
                        <div className="hidden sm:block">
                            <SignUpButton>
                                <Button variant="ringHover">
                                    Create account
                                </Button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div className="ml-auto flex size-9">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "size-full",
                                    },
                                }}
                            />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </header>
    );
};

export default Header;
