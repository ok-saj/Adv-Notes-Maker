import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    folderId: v.optional(v.id("folders")),
    tags: v.array(v.string()),
    isPublic: v.boolean(),
    shareId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_folderId", ["folderId"])
    .index("by_shareId", ["shareId"]),

  folders: defineTable({
    userId: v.string(),
    name: v.string(),
    parentId: v.optional(v.id("folders")),
    color: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_parentId", ["parentId"]),

  sharedNotes: defineTable({
    noteId: v.id("notes"),
    sharedWith: v.string(),
    permission: v.union(v.literal("read"), v.literal("write")),
    createdAt: v.number(),
  })
    .index("by_noteId", ["noteId"])
    .index("by_sharedWith", ["sharedWith"]),
});