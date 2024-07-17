"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, Copy, Globe } from "lucide-react";

interface PublishProps {
    initialData: Doc<"document">;
}

export const Publish = ({ initialData }: PublishProps) => {
    const origin = useOrigin();
    const update = useMutation(api.documents.update);

    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const url = `${origin}/preview/${initialData._id}`;

    const onPublish = () => {
        setIsSubmitting(true);
        const promise = update({
            id: initialData._id,
            isPublished: true,
        }).finally(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "Publishing...",
            success: "Note Published!",
            error: "Failed to publish",
        });
    };
    const onUnPublish = () => {
        setIsSubmitting(true);
        const promise = update({
            id: initialData._id,
            isPublished: false,
        }).finally(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "UnPublishing...",
            success: "Note UnPublished!",
            error: "Failed to unpublish",
        });
    };

    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size={"sm"} variant={"ghost"}>
                    Publish
                    {initialData.isPublished && (
                        <Globe className="text-sky-500 w-4 h-4 ml-2" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-72"
                align="end"
                alignOffset={8}
                forceMount
            >
                {initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Globe className="text-sky-500 animate-pulse h-4 w-4 " />
                            <p className="text-xs font-medium text-sky-500">
                                This Note is live on web.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input
                                value={url}
                                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                                disabled
                            />
                            <Button
                                onClick={onCopy}
                                disabled={copied}
                                className="h-8 rounded-l-none"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 " />
                                ) : (
                                    <Copy className="h-4 w-4 " />
                                )}
                            </Button>
                        </div>
                        <Button size={"sm"} className="w-full text-xs" disabled={isSubmitting} onClick={onUnPublish}>
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe className="h-8 w-8" />
                        <p className="text-sm font-medium py-1">
                            Publish this note
                        </p>
                        <span className="text-sm text-muted-foreground mb-3">
                            Share your work with others
                        </span>
                        <Button
                            onClick={onPublish}
                            className="w-full text-sm"
                            size={"sm"}
                            disabled={isSubmitting}
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};
