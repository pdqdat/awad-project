"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from "@ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@ui/avatar";
import { Button } from "@ui/button";
import { Skeleton } from "@ui/skeleton";

const UserBtn = () => {
    const { isLoaded, user } = useUser();
    const { signOut, openUserProfile } = useClerk();
    const router = useRouter();

    if (!isLoaded) return <Skeleton className="h-9 w-9 rounded-full" />;
    if (!user?.id) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                >
                    <Avatar className="h-9 w-9">
                        <AvatarImage
                            src={user?.imageUrl}
                            alt={user.fullName || "User avatar"}
                        />
                        <AvatarFallback>
                            {(user.fullName || "")
                                .split(" ")
                                .map((word) => word[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="font-medium leading-none">
                            {user.fullName}
                        </p>
                        <p className="text-sm leading-none text-muted-foreground">
                            {user.emailAddresses[0].emailAddress}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        asChild
                        className="hover:bg-secondary-foreground"
                    >
                        <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/profile/watchlist">Watchlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/profile/favorites">Favorites</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/profile/ratings">Ratings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/profile/lists">Your lists</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openUserProfile()}>
                    Edit profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => signOut(() => router.push("/"))}
                >
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserBtn;
