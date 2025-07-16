"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  MoreVertical,
  Edit2,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface FolderTreeProps {
  folders: any[];
  selectedFolderId: Id<"folders"> | undefined;
  onFolderSelect: (folderId: Id<"folders"> | undefined) => void;
}

export function FolderTree({ folders, selectedFolderId, onFolderSelect }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<Id<"folders">>>(new Set());
  const deleteFolder = useMutation(api.folders.deleteFolder);

  const toggleFolder = (folderId: Id<"folders">) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleDeleteFolder = async (folderId: Id<"folders">) => {
    try {
      await deleteFolder({ folderId });
      toast.success("Folder deleted successfully");
    } catch (error) {
      toast.error("Failed to delete folder");
    }
  };

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-text-200 mb-2">
        Folders
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFolderSelect(undefined)}
        className={cn(
          "w-full justify-start text-left mb-2",
          selectedFolderId === undefined && "bg-primary-100/20 text-primary-200 border border-primary-100/30"
        )}
      >
        <Folder className="h-4 w-4 mr-2 text-text-200" />
        All Notes
      </Button>
      {folders.map((folder) => (
        <div key={folder._id} className="space-y-1">
          <div
            className={cn(
              "flex items-center justify-between group rounded-lg px-2 py-1.5 text-sm cursor-pointer hover:bg-background-300/50 transition-colors",
              selectedFolderId === folder._id && "bg-primary-100/20 text-primary-200 border border-primary-100/30"
            )}
          >
            <div className="flex items-center flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 mr-1 text-text-300"
                onClick={() => toggleFolder(folder._id)}
              >
                {expandedFolders.has(folder._id) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
              <div 
                className="flex items-center flex-1 min-w-0"
                onClick={() => onFolderSelect(folder._id)}
              >
                {selectedFolderId === folder._id ? (
                  <FolderOpen 
                    className="h-4 w-4 mr-2" 
                    style={{ color: folder.color || '#3B82F6' }}
                  />
                ) : (
                  <Folder 
                    className="h-4 w-4 mr-2" 
                    style={{ color: folder.color || '#d2ddf4' }}
                  />
                )}
                <span className="truncate text-text-100">{folder.name}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-background-300"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass">
                <DropdownMenuItem>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteFolder(folder._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}