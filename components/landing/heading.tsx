"use client"

import { useConvexAuth } from "convex/react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react"; 
import { Spinner } from "../spinner";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth(); 
    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                Your Ideas, Documents, & Plans. Unified. Welcome to <span className="underline">CoWrite</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                CoWrite is a connected workspace where <br />
                better, faster, work happens
            </h3>
            {isLoading && (
                <div className="w-full flex items-center justify-center"> 
                    <Spinner size={"lg"} />
                </div>

            )}
            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href="/documents">
                        Enter CoWrite
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                    
                </Button>
            )}
            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button>
                        Start with CoWrite
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </SignInButton>
            )}
            
            
        </div>
    );
}

