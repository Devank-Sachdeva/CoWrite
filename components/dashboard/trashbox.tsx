"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../spinner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "../ui/input";
import { ConfirmModal } from "../modals/confirm-modal";

export const TrashBox = () => {
    const router = useRouter();
    const params = useParams();
    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);

    const [search, setSearch] = useState("");
    const filterDocs = documents?.filter((doc)=> {
        return doc.title.toLowerCase().includes(search.toLowerCase());
    })

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    }

    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        docuemntId: Id<"document">
    ) => {
        event.stopPropagation();
        const promise = restore({ id: docuemntId });

        toast.promise(promise, {
            loading: "Restoring Note...",
            success: "Note restored",
            error: "Failed to restore Note",
        });
    };

    const onDelete = ( docuemntId: Id<"document">) => {
        const promise = remove({ id: docuemntId });

        toast.promise(promise, {
            loading: "Deleting Note...",
            success: "Note deleted!",
            error: "Failed to delete Note",
        })

        if (params.docuemntId === docuemntId) {
            router.push("/documents")
        }
    }

    if (documents === undefined) {
        return (
            <div className="h-full w-full items-center justify-center p-4">
                <Spinner size={"lg"} />
            </div>
        )
    }


    return (
        <div className="text-sm ">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Filter by Page Title"
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-sm text-center">
                    No Notes found.
                </p>
                {filterDocs?.map((doc) => (
                    <div
                        className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
                        key={doc._id}
                        role="button"
                        onClick={() => onClick(doc._id)}
                    >
                        <span className="truncate pl-2">{doc.title}</span>
                        <div className="flex">
                            <div
                                onClick={(e) => onRestore(e, doc._id)}
                                role="button"
                                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                            >
                                <Undo className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <ConfirmModal onConfirm={() => onDelete(doc._id)}>
                                <div
                                    role="button"
                                    className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                >
                                    <Trash className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}