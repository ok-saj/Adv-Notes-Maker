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
      <div className="text-sm font-medium text-text-200 mb-2">
        Notes ({notes.length})
      </div>
      {notes.map((note) => (
        <div
          key={note._id}
          className={cn(
            "flex items-center justify-between group rounded-lg px-2 py-2 text-sm cursor-pointer hover:bg-background-300/50 transition-colors",
            selectedNoteId === note._id && "bg-primary-100/20 text-primary-200 border border-primary-100/30"
          )}
          onClick={() => onNoteSelect(note._id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            <FileText className="h-4 w-4 mr-2 text-text-300" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate text-text-100">{note.title}</div>
              <div className="text-xs text-text-300 truncate mt-1">
                {truncateContent(note.content)}
              </div>
              <div className="text-xs text-text-300 mt-1">
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-background-300"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass">
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
                className="text-red-400 hover:text-red-300"
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