"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { 
  Save, 
  FileText, 
  Share2, 
  Tag,
  Calendar,
  Sparkles,
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
    <div className="flex-1 flex flex-col h-full glass">
      {/* Header */}
      <div className="border-b border-background-300 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-accent-100 rounded-lg blur opacity-20"></div>
              <div className="relative bg-primary-100/10 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-primary-100" />
              </div>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-none bg-transparent focus:ring-0 focus:outline-none text-text-100 placeholder:text-text-300"
              placeholder="Untitled Note"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="hover:bg-primary-100/10 hover:text-primary-100 transition-colors"
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
              className="hover:bg-accent-100/10 hover:text-accent-100 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-text-300" />
            <span className="text-sm text-text-300">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-primary-100/10 text-primary-100 border-primary-100/20 hover:bg-primary-100/20 transition-colors">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-primary-100/70 hover:text-primary-100 transition-colors"
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
              className="w-24 h-7 text-xs border-background-300 bg-background-300/30 focus:border-primary-100 focus:ring-primary-100/20 text-text-100 placeholder:text-text-300"
            />
          </div>
        </div>

        {/* Last saved info */}
        {lastSaved && (
          <div className="flex items-center text-xs text-text-300">
            <Calendar className="h-3 w-3 mr-2" />
            <span>Last saved: {lastSaved.toLocaleString()}</span>
            <Sparkles className="h-3 w-3 ml-2 text-primary-100" />
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-6">
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