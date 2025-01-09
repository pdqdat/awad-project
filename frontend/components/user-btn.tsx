"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "nextjs-toploader/app";
import Link from "next/link";
import {
    Star,
    LogOut,
    Pencil,
    List,
    Heart,
    Film,
    UserRound,
} from "lucide-react";

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
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <UserRound />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/profile/watchlist">
                            <Film />
                            Watchlist
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/profile/favorites">
                            <Heart />
                            Favorites
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/profile/ratings">
                            <Star />
                            Ratings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/profile/lists">
                            <List />
                            Your lists
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openUserProfile()}>
                    <Pencil />
                    Edit profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => signOut(() => router.push("/"))}
                >
                    <LogOut />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserBtn;
