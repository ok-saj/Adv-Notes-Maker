import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const createFolder = mutation({
  args: {
    name: v.string(),
    parentId: v.optional(v.id("folders")),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const folderId = await ctx.db.insert("folders", {
      userId: identity.subject,
      name: args.name,
      parentId: args.parentId,
      color: args.color,
      createdAt: Date.now(),
    });

    return folderId;
  },
});

export const updateFolder = mutation({
  args: {
    folderId: v.id("folders"),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.userId !== identity.subject) {
      throw new Error("Folder not found or unauthorized");
    }

    const updates: Partial<Doc<"folders">> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.color !== undefined) updates.color = args.color;

    await ctx.db.patch(args.folderId, updates);
  },
});

export const deleteFolder = mutation({
  args: { folderId: v.id("folders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.userId !== identity.subject) {
      throw new Error("Folder not found or unauthorized");
    }

    // Delete all notes in this folder
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_folderId", (q) => q.eq("folderId", args.folderId))
      .collect();

    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    // Delete all subfolders
    const subfolders = await ctx.db
      .query("folders")
      .withIndex("by_parentId", (q) => q.eq("parentId", args.folderId))
      .collect();

    for (const subfolder of subfolders) {
      await ctx.db.delete(subfolder._id);
    }

    await ctx.db.delete(args.folderId);
  },
});

export const getFolders = query({
  args: { parentId: v.optional(v.id("folders")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const folders = await ctx.db
      .query("folders")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("parentId"), args.parentId))
      .collect();

    return folders.sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const getFolder = query({
  args: { folderId: v.id("folders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.userId !== identity.subject) {
      return null;
    }

    return folder;
  },
});