"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { NoteViewer } from "@/components/NoteViewer";

export default function SharedNotePage() {
  const { shareId } = useParams();
  const note = useQuery(api.notes.getSharedNote, { shareId: shareId as string });

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Note not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This note may have been deleted or is no longer shared.
          </p>
        </div>
      </div>
    );
  }

  return <NoteViewer note={note} />;
}