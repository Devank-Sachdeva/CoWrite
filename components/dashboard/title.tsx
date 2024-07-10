"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface TitleProps {
    initialData: Doc<"document">;
}

export const Title = ({ initialData }: TitleProps) => {
    const update = useMutation(api.documents.update);
    const inputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialData.title || "Untitled");

    const enableInput = () => {
        console.log("clicked")
        setTitle(initialData.title);
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(
                0,
                inputRef.current.value.length
            );
        }, 0);
    };

    const disableInput = () => {
        setIsEditing(false);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        update({
            id: initialData._id,
            title: e.target.value || "Untitled",
        });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            disableInput();
        }
    };

    return (
        <div className="flex items-center gap-x-1" >
            {!!initialData.icon && <p>{initialData.icon}</p>}
            {isEditing ? (
                <Input
                    className="h-7 px-2 focus-visible:ring-transparent"
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disableInput}
                    onKeyDown={onKeyDown}
                    onChange={onChange}
                    
                    value={title}
                />
            ) : (
                <Button onClick={enableInput} variant={"ghost"} size={"sm"}>
                    <span className="truncate">{initialData.title}</span>
                </Button>
            )}
        </div>
    );
};

Title.Skeleton = function TitleSkeleton() {
    return (
        <div>
            <Skeleton className="h-7 w-96 rounded-md" />
        </div>
    )
}