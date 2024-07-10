"use client"

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "../mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Spinner } from "../spinner";
import Link from "next/link";

export const NavBar = () => {
    const scrolled = useScrollTop();
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div className={cn("w-full z-50 bg-background fixed top-0 flex items-center px-6 py-3 dark:bg-[#1F1F1F]", scrolled && "border-b shadow-sm")}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-center flex w-full items-center gap-x-2">
                {isLoading && <Spinner />}
                {!isAuthenticated && !isLoading && (
                    <>
                        <SignInButton mode="modal">
                            <Button variant={"ghost"} size={"sm"}>
                                Login
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button size={"sm"}>
                                Get CoWrite free
                            </Button>
                        </SignUpButton>
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant={"ghost"} size={"sm"} asChild>
                            <Link href={"/documents"}>Dashboard</Link>
                        </Button>
                        <UserButton />
                    </>
                )}
                <ModeToggle />
            </div>
        </div>
    );
}

