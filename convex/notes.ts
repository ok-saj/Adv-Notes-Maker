import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const createNote = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    folderId: v.optional(v.id("folders")),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const noteId = await ctx.db.insert("notes", {
      userId: identity.subject,
      title: args.title,
      content: args.content,
      folderId: args.folderId,
      tags: args.tags,
      isPublic: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return noteId;
  },
});

export const updateNote = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    folderId: v.optional(v.id("folders")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== identity.subject) {
      throw new Error("Note not found or unauthorized");
    }

    const updates: Partial<Doc<"notes">> = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;
    if (args.folderId !== undefined) updates.folderId = args.folderId;
    if (args.tags !== undefined) updates.tags = args.tags;

    await ctx.db.patch(args.noteId, updates);
  },
});

export const deleteNote = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== identity.subject) {
      throw new Error("Note not found or unauthorized");
    }

    await ctx.db.delete(args.noteId);
  },
});

export const getNotes = query({
  args: { folderId: v.optional(v.id("folders")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("folderId"), args.folderId))
      .collect();

    return notes.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getNote = query({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== identity.subject) {
      return null;
    }

    return note;
  },
});

export const shareNote = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== identity.subject) {
      throw new Error("Note not found or unauthorized");
    }

    const shareId = Math.random().toString(36).substring(2, 15);
    
    await ctx.db.patch(args.noteId, {
      isPublic: true,
      shareId: shareId,
    });

    return shareId;
  },
});

export const getSharedNote = query({
  args: { shareId: v.string() },
  handler: async (ctx, args) => {
    const note = await ctx.db
      .query("notes")
      .withIndex("by_shareId", (q) => q.eq("shareId", args.shareId))
      .first();

    if (!note || !note.isPublic) {
      return null;
    }

    return note;
  },
});

export const searchNotes = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(args.query.toLowerCase()) ||
        note.content.toLowerCase().includes(args.query.toLowerCase())
    );
  },
});