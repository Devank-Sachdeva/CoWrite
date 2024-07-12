"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { mutation } from "@/convex/_generated/server";
import { useClerk, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

const DashBoardPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const create = useMutation(api.documents.create);

    const onCreateHandler = () => {
        const promise = create({
            title: "Untitled",
        }).then((res) => router.push(`/documents/${res}`));

        toast.promise(promise, {
            loading: "Creating Note...",
            success: "New Note Created!",
            error: "Failed to create Note"
        })
    }

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
            <Button onClick={onCreateHandler}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create a Note
            </Button>
        </div>
    )
}

export default DashBoardPage;