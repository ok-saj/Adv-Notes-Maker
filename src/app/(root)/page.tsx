"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { DashboardLayout } from "./_components/DashboardLayout";
import { NoteEditor } from "./_components/NoteEditor";


export default function Dashboard() {
  const { user } = useUser();
 
  const [selectedNoteId, setSelectedNoteId] = useState<Id<"notes"> | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<Id<"folders"> | undefined>(undefined);

  const notes = useQuery(api.notes.getNotes, { folderId: selectedFolderId || undefined });
  const selectedNote = useQuery(api.notes.getNote, 
    selectedNoteId ? { noteId: selectedNoteId } : "skip"
  );

  if (!user) {
     return null;
  }

  return (
    <DashboardLayout
      selectedFolderId={selectedFolderId}
      onFolderSelect={setSelectedFolderId}
      selectedNoteId={selectedNoteId}
      onNoteSelect={setSelectedNoteId}
      notes={notes || []}
    >
      {selectedNote ? (
        <NoteEditor
          note={selectedNote}
          onSave={() => {
            // Auto-save is handled in the editor
          }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Select a note to edit
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a note from the sidebar or create a new one to get started
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}