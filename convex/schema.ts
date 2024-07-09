import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    document: defineTable({
        title: v.string(),
        userId: v.string(),
        isArchived: v.boolean(),
        parentDocumentId: v.optional(v.id("document")),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.boolean(),
    })
    .index("by_user", ["userId"])
    .index("by_parent", ["userId","parentDocumentId"])
})