import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new Error("Unauthorized");

        const userId = identity.subject;

        const documents = await ctx.db.query("document").collect();

        return documents;
    }
})

export const getDocuments = query({
    args: {
        parentDocumentId: v.optional(v.id("document")),
    },
    handler: async (ctx, argc) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new Error("Unauthorized");

        const userId = identity.subject;
        const documents = await ctx.db.query("document").withIndex("by_parent", (q) => q.eq("userId", userId).eq("parentDocumentId", argc.parentDocumentId)).filter((q) => q.eq(q.field("isArchived"), false)).order("desc").collect();
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
    }
})