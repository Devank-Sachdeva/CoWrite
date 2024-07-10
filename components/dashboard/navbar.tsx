"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./title";

interface NavBarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

export const NavBar = ({ isCollapsed, onResetWidth } : NavBarProps) => {

    const params = useParams();
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"document">
    })

    if (document === undefined) {
        return (
            <nav className="bg-background dark:bg-[#1F1F1F] px-4 py-4 w-full flex items-center gap-x-4">
                <Title.Skeleton />
            </nav>
        );
    }

    if (document === null) {
        return null;
    }
    return (
        <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
            {isCollapsed && (
                <MenuIcon
                    role="button"
                    onClick={onResetWidth}
                    className="h-6 w-6 text-muted-foreground"
                />
            )}
            <div className="flex items-center"> 
                <Title initialData={document} />
            </div>
        </nav>
    )
}