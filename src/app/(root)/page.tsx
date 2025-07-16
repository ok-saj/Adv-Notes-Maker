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
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-muted/5 to-background">
          <div className="text-center max-w-md mx-auto animate-fade-in">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-20"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto border border-border/50">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full flex items-center justify-center">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ready to Create?
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Select a note from the sidebar to start editing, or create a new one to begin your creative journey.
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Rich Text Editor</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-accent-foreground" />
                <span>Auto Save</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}