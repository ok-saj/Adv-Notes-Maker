"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { FolderTree } from "./FolderTree";
import { NoteList } from "./NoteList";
import { CreateNoteDialog } from "./CreateNoteDialog";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { Plus, FolderPlus, FileText, Sparkles } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  selectedFolderId: Id<"folders"> | undefined;
  onFolderSelect: (folderId: Id<"folders"> | undefined) => void;
  selectedNoteId: Id<"notes"> | null;
  onNoteSelect: (noteId: Id<"notes"> | null) => void;
  notes: any[];
}

export function Sidebar({
  isOpen,
  selectedFolderId,
  onFolderSelect,
  selectedNoteId,
  onNoteSelect,
  notes,
}: SidebarProps) {
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  
  const folders = useQuery(api.folders.getFolders, { parentId: selectedFolderId || undefined });

  return (
    <>
      <div
        className={cn(
          "glass border-r border-border/50 flex flex-col transition-all duration-300 backdrop-blur-xl",
          isOpen ? "w-80" : "w-0 overflow-hidden"
        )}
      >
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Workspace
              </h2>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateNote(true)}
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateFolder(true)}
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateNote(true)}
              className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <span>New Note</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateFolder(true)}
              className="w-full justify-start text-left hover:bg-accent/10 hover:text-accent-foreground transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <FolderPlus className="h-4 w-4 text-accent-foreground" />
                </div>
                <span>New Folder</span>
              </div>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <FolderTree
              folders={folders || []}
              selectedFolderId={selectedFolderId}
              onFolderSelect={onFolderSelect}
            />
          </div>

          <div className="p-4 border-t border-border/50">
            <NoteList
              notes={notes}
              selectedNoteId={selectedNoteId}
              onNoteSelect={onNoteSelect}
            />
          </div>
        </div>
      </div>

      <CreateNoteDialog
        isOpen={showCreateNote}
        onClose={() => setShowCreateNote(false)}
        folderId={selectedFolderId}
      />

      <CreateFolderDialog
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        parentId={selectedFolderId}
      />
    </>
  );
}