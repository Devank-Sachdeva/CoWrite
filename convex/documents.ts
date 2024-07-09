import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

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
    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const userId = identity.subject;

        const existingDoc = await ctx.db.get(args.id);

        if (!existingDoc) throw new Error("Document not found");
        if (existingDoc.userId !== userId) throw new Error("Unauthorized");

        const recursiveRestore = async (docId: Id<"document">) => {
            const children = await ctx.db.query("document").withIndex("by_parent", (q) => q.eq("userId",userId).eq("parentDocumentId",docId)).collect();

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false,
                });
                await recursiveRestore(child._id);
            }
        }

        const options: Partial<Doc<"document">> = {
            isArchived: false
        }

        if (existingDoc.parentDocumentId) {
            const parent = await ctx.db.get(existingDoc.parentDocumentId);

            if (parent?.isArchived){
                options.parentDocumentId = undefined;
            }
        }

        const doc = await ctx.db.patch(args.id,options);
        await recursiveRestore(args.id);

        return doc;
    }
});

export const remove = mutation({
    args:{
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
            const children = await ctx.db.query("document").withIndex("by_parent", (q) => q.eq("userId", userId).eq("parentDocumentId", docId)).collect();

            for (const child of children){
                await ctx.db.delete(child._id);
                await recursiveRemove(child._id);
            }
        }

        const doc = await ctx.db.delete(args.id);

        return doc;
    }
})