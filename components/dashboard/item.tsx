"use client";

import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
    ArchiveIcon,
    ChevronDown,
    ChevronRight,
    LucideIcon,
    MoreHorizontal,
    PlusIcon,
    Trash,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { archive } from "@/convex/documents";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUser } from "@clerk/nextjs";

interface ItemProps {
    id?: Id<"document">;
    documentIcon?: string;
    active?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    expanded?: boolean;
    onClick?: () => void;
    label: string;
    icon: LucideIcon;
}
export const Item = ({
    id,
    documentIcon,
    active,
    isSearch,
    level,
    expanded,
    onExpand,
    onClick,
    label,
    icon: Icon,
}: ItemProps) => {
    const create = useMutation(api.documents.create);
    const archive = useMutation(api.documents.archive)
    const router = useRouter();
    const { user } = useUser();
    const handleExpand = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        onExpand?.();
    };
    const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (!id) return;

        const promise = create({
            title: "Untitled Document",
            parentDocumentId: id,
        }).then((doc) => {
            if (!expanded) onExpand?.();
            else router.push(`/documents/${doc}`);
        });

        toast.promise(promise, {
            loading: "Creating a new Note...",
            success: "New Note created",
            error: "Failed to create note",
        });
    };

    const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();

        if (!id) return;
        const promise = archive({ id })

        toast.promise(promise, {
            loading: "Moving to Trash",
            success: "Note moved to Trash",
            error: "Failed to Archive Note"
        
        })
    }
    const ChevronIcon = expanded ? ChevronDown : ChevronRight;
    return (
        <div
            onClick={onClick}
            role="button"
            style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
            className={cn(
                "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary",
                isSearch && "text-primary",
                "cursor-pointer"
            )}
        >
            {!!id && (
                <div
                    role="button"
                    className="h-full rounded-sm dark:hover:bg-neutral-600 hover:bg-neutral-300 mr-1"
                    onClick={handleExpand}
                >
                    <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                </div>
            )}

            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
            ) : (
                <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
            )}

            <span className="truncate">{label}</span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[12px] font-medium text-muted-foreground">
                    <span className="text-[8px]">⌘</span> K
                </kbd>
            )}
            {!!id && (
                <div
                    className="ml-auto flex items-center gap-x-2"
                    role="button"
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            asChild
                        >
                            <div
                                role="button"
                                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onArchive}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="text-xs text-muted-foreground p-2">
                                Last Edited by {user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                        className="opacity-0 group-hover:opacity-100 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                        onClick={onCreate}
                    >
                        <PlusIcon className="h-4 w-4" />
                    </div>
                </div>
            )}
        </div>
    );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div
            style={{ paddingLeft: level ? level * 12 + 12 : 12 }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    );
};
