import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { useMutation } from "convex/react";

export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new Error("Unauthorized");

        const userId = identity.subject;

        const documents = await ctx.db.query("document").collect();

        return documents;
    },
});

export const getDocuments = query({
    args: {
        parentDocumentId: v.optional(v.id("document")),
    },
    handler: async (ctx, argc) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new Error("Unauthorized");

        const userId = identity.subject;
        const documents = await ctx.db
            .query("document")
            .withIndex("by_parent", (q) =>
                q
                    .eq("userId", userId)
                    .eq("parentDocumentId", argc.parentDocumentId)
            )
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect();
        return documents;
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        parentDocumentId: v.optional(v.id("document")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new Error("Unauthorized");

        const userId = identity.subject;
        const document = await ctx.db.insert("document", {
            title: args.title,
            userId,
            parentDocumentId: args.parentDocumentId,
            isArchived: false,
            isPublished: false,
        });

        return document;
    },
});

export const archive = mutation({
    args: {
        id: v.id("document"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new Error("Unauthenticated");

        const userId = identity.subject;
        const existingDoc = await ctx.db.get(args.id);
        if (!existingDoc) throw new Error("Document not found");
        if (existingDoc.userId !== userId) throw new Error("Unauthorized");
        const recursiveArchive = async (docId: Id<"document">) => {
            const children = await ctx.db
                .query("document")
                .withIndex("by_parent", (q) =>
                    q.eq("userId", userId).eq("parentDocumentId", docId)
                )
                .collect();

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                });
                await recursiveArchive(child._id);
            }
        };
        const document = await ctx.db.patch(args.id, {
            isArchived: true,
        });

        recursiveArchive(args.id);

        return document;
    },
});

export const getTrash = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new Error("Unauthenticated");

        const userId = identity.subject;

        const document = ctx.db
            .query("document")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isArchived"), true))
            .order("desc")
            .collect();
        return document;
    },
});

export const restore = mutation({
    args: {
        id: v.id("document"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const userId = identity.subject;

        const existingDoc = await ctx.db.get(args.id);

        if (!existingDoc) throw new Error("Document not found");
        if (existingDoc.userId !== userId) throw new Error("Unauthorized");

        const recursiveRestore = async (docId: Id<"document">) => {
            const children = await ctx.db
                .query("document")
                .withIndex("by_parent", (q) =>
                    q.eq("userId", userId).eq("parentDocumentId", docId)
                )
                .collect();

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false,
                });
                await recursiveRestore(child._id);
            }
        };

        const options: Partial<Doc<"document">> = {
            isArchived: false,
        };

        if (existingDoc.parentDocumentId) {
            const parent = await ctx.db.get(existingDoc.parentDocumentId);

            if (parent?.isArchived) {
                options.parentDocumentId = undefined;
            }
        }

        const doc = await ctx.db.patch(args.id, options);
        await recursiveRestore(args.id);

        return doc;
    },
});

export const remove = mutation({
    args: {
        id: v.id("document"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const userId = identity.subject;

        const existingDoc = await ctx.db.get(args.id);

        if (!existingDoc) throw new Error("Document not found");
        if (existingDoc.userId !== userId) throw new Error("Unauthorized");

        const recursiveRemove = async (docId: Id<"document">) => {
            const children = await ctx.db
                .query("document")
                .withIndex("by_parent", (q) =>
                    q.eq("userId", userId).eq("parentDocumentId", docId)
                )
                .collect();

            for (const child of children) {
                await ctx.db.delete(child._id);
                await recursiveRemove(child._id);
            }
        };

        const doc = await ctx.db.delete(args.id);

        return doc;
    },
});

export const getSearch = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new Error("Unauthenticated");

        const userId = identity.subject;

        const documents = await ctx.db
            .query("document")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect();

        return documents;
    },
});

export const getById = query({
    args: {
        documentId: v.id("document"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const document = await ctx.db.get(args.documentId);

        if (!document) throw new Error("Document not found");

        if (document.isPublished && !document.isArchived){
            return document;
        }

        if (!identity) throw new Error("Unauthenticated");
        
        const userid = identity.subject;
        if (document.userId !== userid){
            throw new Error("Unauthorized");
        }
        return document;
    }
})

export const update = mutation({
    args: {
        id: v.id("document"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const userId = identity.subject;

        const { id, ...rest } = args;
        const existingDoc = await ctx.db.get(id);

        if (!existingDoc) throw new Error("Document not found");
        if (existingDoc.userId !== userId) throw new Error("Unauthorized");

        const document = await ctx.db.patch(id, rest);

        return document;
    }
})

export const removeIcon = mutation({
    args: {
        id: v.id("document"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const userId = identity.subject;

        const existingDoc = await ctx.db.get(args.id);

        if (!existingDoc) throw new Error("Document not found");
        if (existingDoc.userId !== userId) throw new Error("Unauthorized");

        const document = await ctx.db.patch(args.id, {
            icon: undefined,
        });
        return document;
    }
})
export const removeCoverImage = mutation({
    args: {
        id: v.id("document"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const userId = identity.subject;

        const existingDoc = await ctx.db.get(args.id);

        if (!existingDoc) throw new Error("Document not found");
        if (existingDoc.userId !== userId) throw new Error("Unauthorized");

        const document = await ctx.db.patch(args.id, {
            coverImage: undefined,
        });
        return document;
    }
})