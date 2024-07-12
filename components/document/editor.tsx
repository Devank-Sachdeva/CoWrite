"use client";

import { PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import "@blocknote/mantine/style.css";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
    onChange: (value: string) => void;
    initialData?: string;
    editable?: boolean;
}

export const Editor = ({ onChange, initialData }: EditorProps) => {
    const { resolvedTheme } = useTheme();
    const { edgestore } = useEdgeStore();

    const handleUpload = async (file: File) => {
        const { url } = await edgestore.publicFiles.upload({file});
        return url;
    }
    
    const editor = useCreateBlockNote({
        initialContent: initialData
            ? (JSON.parse(initialData) as PartialBlock[])
            : undefined,
        uploadFile: handleUpload,
    });

    const onContentChange = () => {
        onChange(JSON.stringify(editor.document, null, 2));
    };


    return (

        <BlockNoteView
            editor={editor}
            onChange={onContentChange}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            className="z-[0]"
        />
    );
};
