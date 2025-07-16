"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


interface CreateNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  folderId: Id<"folders"> | undefined;
}

export function CreateNoteDialog({ isOpen, onClose, folderId }: CreateNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const createNote = useMutation(api.notes.createNote);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await createNote({
        title: title.trim(),
        content: content.trim(),
        folderId: folderId,
        tags: [],
      });
      
      toast.success("Note created successfully");
      setTitle("");
      setContent("");
      onClose();
    } catch (error) {
      toast.error("Failed to create note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content (optional)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter note content..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}