"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Item } from "@/components/dashboard/item";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
    parentDocumentId?: Id<"document">;
    level?: number;
    data?: Doc<"document">[];
}
export const DocumentList = ({
    parentDocumentId,
    level,
}: DocumentListProps) => {
    const params = useParams();
    const router = useRouter();

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = (documentId: string) => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId],
        }));
    };

    const documents = useQuery(api.documents.getDocuments, {
        parentDocumentId: parentDocumentId,
    });

    const onRedirect = (docuemntId: string) => {
        router.push(`/documents/${docuemntId}`);
    };

    if (documents === undefined) {
        return (
            <>
                <Item.Skeleton level={level} />
                {level === 0 && (
                    <>
                        <Item.Skeleton level={level} />
                        <Item.Skeleton level={level} />
                    </>
                )}
            </>
        );
    }
    return (
        <>
            <p
                style={{
                    paddingLeft: level ? `${level * 12 + 25}px` : undefined,
                }}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                No Pages Inside
            </p>
            {documents.map((doc) => {
                console.log(doc);
                return <div key={doc._id}>
                    <Item
                        id={doc._id}
                        onClick={() => onRedirect(doc._id)}
                        label={doc.title}
                        icon={FileIcon}
                        documentIcon={doc.icon}
                        active={params.docuemntId === doc._id}
                        level={level}
                        onExpand={() => onExpand(doc._id)}
                        expanded={expanded[doc._id]}
                    />
                    {expanded[doc._id] && (
                        <DocumentList parentDocumentId={doc._id} level={level ? level+1 : 1}  />
                    )}
                </div>;
            })}
        </>
    );
};
