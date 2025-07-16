"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { 
  Save, 
  FileText, 
  Share2, 
  Tag,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PDFUploader } from "./PDFUploader";
import { ExportOptions } from "./ExportOptions";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "./RichTextEditor";
import { ShareDialog } from "./ShareDialog";

interface NoteEditorProps {
  note: any;
  onSave: () => void;
}

export function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [newTag, setNewTag] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateNote = useMutation(api.notes.updateNote);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content || JSON.stringify(tags) !== JSON.stringify(note.tags)) {
        handleSave();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, tags]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateNote({
        noteId: note._id,
        title,
        content,
        tags,
      });
      setLastSaved(new Date());
      onSave();
    } catch (error) {
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePDFTextExtracted = (text: string) => {
    setContent((prev: string) => prev + '\n\n' + text);
    toast.success("PDF text extracted successfully");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold border-none bg-transparent focus:ring-0 focus:outline-none"
              placeholder="Untitled Note"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <PDFUploader onTextExtracted={handlePDFTextExtracted} />
            <ExportOptions title={title} content={content} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareDialog(true)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center space-x-2 mb-2">
          <Tag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            ))}
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add tag..."
              className="w-20 h-6 text-xs border-none bg-transparent focus:ring-0"
            />
          </div>
        </div>

        {/* Last saved info */}
        {lastSaved && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3 mr-1" />
            Last saved: {lastSaved.toLocaleString()}
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-4">
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Start writing your note..."
        />
      </div>

      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        noteId={note._id}
      />
    </div>
  );
}