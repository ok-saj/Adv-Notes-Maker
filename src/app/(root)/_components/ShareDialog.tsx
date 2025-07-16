"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Copy, Check, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: Id<"notes">;
}

export function ShareDialog({ isOpen, onClose, noteId }: ShareDialogProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const shareNote = useMutation(api.notes.shareNote);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareId = await shareNote({ noteId });
      const url = `${window.location.origin}/shared/${shareId}`;
      setShareUrl(url);
      toast.success("Share link generated successfully");
    } catch (error) {
      toast.error("Failed to generate share link");
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share Note
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Generate a public link to share this note with others. Anyone with the link will be able to view the note.
          </div>

          {!shareUrl ? (
            <Button onClick={handleShare} disabled={isSharing} className="w-full">
              {isSharing ? "Generating Link..." : "Generate Share Link"}
            </Button>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="share-url">Share Link</Label>
              <div className="flex space-x-2">
                <Input
                  id="share-url"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}