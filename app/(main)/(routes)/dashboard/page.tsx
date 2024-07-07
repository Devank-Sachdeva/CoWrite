"use client"

import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

const DashBoardPage = () => {
    const { user } = useUser();

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image 
                src="/empty.png"
                alt="Empty"
                height={300}
                width={300}
                className="dark:hidden"  
            />
            <Image 
                src="/empty-dark.png"
                alt="Empty"
                height={300}
                width={300}
                className="hidden dark:block"  
            />
            <h2>
                Welcome to {user?.firstName}&apos;s CoWrite 
            </h2>
            <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create a Note
            </Button>
        </div>
    )
}

export default DashBoardPage;