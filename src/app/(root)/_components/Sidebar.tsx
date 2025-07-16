"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { FolderTree } from "./FolderTree";
import { NoteList } from "./NoteList";
import { CreateNoteDialog } from "./CreateNoteDialog";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { Plus, FolderPlus, FileText } from "lucide-react";
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
          "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300",
          isOpen ? "w-80" : "w-0 overflow-hidden"
        )}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notes
            </h2>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateNote(true)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateFolder(true)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
              className="w-full justify-start text-left"
            >
              <FileText className="h-4 w-4 mr-2" />
              New Note
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateFolder(true)}
              className="w-full justify-start text-left"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
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

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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