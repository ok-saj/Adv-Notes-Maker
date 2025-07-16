"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { DashboardLayout } from "./_components/DashboardLayout";
import { NoteEditor } from "./_components/NoteEditor";
import { FileText, Sparkles, Zap } from "lucide-react";

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
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background-100 via-background-200/20 to-background-100">
          <div className="text-center max-w-md mx-auto animate-fade-in">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full blur-2xl opacity-20"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-primary-100/20 to-accent-100/20 rounded-full flex items-center justify-center mx-auto border border-background-300">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100/30 to-accent-100/30 rounded-full flex items-center justify-center">
                  <FileText className="w-10 h-10 text-primary-100" />
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-text-100 mb-3 gradient-text">
              Ready to Create?
            </h2>
            <p className="text-text-200 mb-6 leading-relaxed">
              Select a note from the sidebar to start editing, or create a new one to begin your creative journey.
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-text-300">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-primary-100" />
                <span>Rich Text Editor</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-accent-100" />
                <span>Auto Save</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}