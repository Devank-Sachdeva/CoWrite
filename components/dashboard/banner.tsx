"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ConfirmModal } from "../modals/confirm-modal";

interface BannerProps {
    documentId: Id<"document">;
}

export const Banner = ({ documentId }: BannerProps) => {
    const router = useRouter();
    const remove = useMutation(api.documents.remove);
    const restore = useMutation(api.documents.restore);

    const onRemove = () => {
        const promise = remove({ id: documentId })
        toast.promise(promise, {
            success: "Document removed",
            error: "Failed to remove document",
            loading: "Deleting Documment...",
        });
        router.push("/documents");
    };

    const onRestore = () => {
        const promise = restore({ id: documentId })

        toast.promise(promise, {
            success: "Document restored",
            error: "Failed to restore document",
            loading: "Restoring Documment...",
        });
    };

    return (
        <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center justify-center gap-x-2">
            <p>This Document is in Trash</p>
            <Button
                size={"sm"}
                onClick={onRestore}
                variant={"outline"}
                className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore Page
            </Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button
                    size={"sm"}
                    variant={"outline"}
                    className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Delete Forever
                </Button>
            </ConfirmModal>
        </div>
    );
};
