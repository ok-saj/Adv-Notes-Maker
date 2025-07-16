"use client";

import { useMutation } from "convex/react";
import { 
  FileText, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Share2
} from "lucide-react";
import toast from "react-hot-toast";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NoteListProps {
  notes: any[];
  selectedNoteId: Id<"notes"> | null;
  onNoteSelect: (noteId: Id<"notes">) => void;
}

export function NoteList({ notes, selectedNoteId, onNoteSelect }: NoteListProps) {
  const deleteNote = useMutation(api.notes.deleteNote);
  const shareNote = useMutation(api.notes.shareNote);

  const handleDeleteNote = async (noteId: Id<"notes">) => {
    try {
      await deleteNote({ noteId });
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleShareNote = async (noteId: Id<"notes">) => {
    try {
      const shareId = await shareNote({ noteId });
      const url = `${window.location.origin}/shared/${shareId}`;
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied to clipboard");
    } catch (error) {
      toast.error("Failed to share note");
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
  };

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Notes ({notes.length})
      </div>
      {notes.map((note) => (
        <div
          key={note._id}
          className={cn(
            "flex items-center justify-between group rounded-lg px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
            selectedNoteId === note._id && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
          )}
          onClick={() => onNoteSelect(note._id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            <FileText className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{note.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                {truncateContent(note.content)}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareNote(note._id);
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note._id);
                }}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}