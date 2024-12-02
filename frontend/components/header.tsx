import { Clapperboard } from "lucide-react";
import {
    UserButton,
    SignInButton,
    SignedIn,
    SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";

import { appName } from "@lib/const";
import { NavLink } from "@comp/nav-link";
import { Button } from "@ui/button";

const Header = async () => {
    return (
        <header className="flex border-b bg-secondary py-2">
            <nav className="container flex items-center gap-6 font-medium">
                <Link href="/">
                    <div className="mr-auto flex items-center gap-2 font-semibold">
                        <Clapperboard className="size-8" />
                        <span className="sr-only text-lg font-semibold md:not-sr-only">
                            {appName}
                        </span>
                    </div>
                </Link>
                <NavLink href="/movie">Movie</NavLink>
                <NavLink href="/cast">Cast</NavLink>
                <SignedIn>
                    <NavLink href="/chat">Chat</NavLink>
                </SignedIn>
                <SignedOut>
                    <div className="ml-auto flex gap-4">
                        <SignInButton>
                            <Button size="sm" variant="ringHover">
                                Sign in
                            </Button>
                        </SignInButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <div className="ml-auto flex size-8">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "size-full",
                                },
                            }}
                        />
                    </div>
                </SignedIn>
            </nav>
        </header>
    );
};

export default Header;
