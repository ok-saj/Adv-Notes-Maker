"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Id } from "../../../../convex/_generated/dataModel";

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: Id<"folders"> | undefined;
}

export function CreateFolderDialog({ isOpen, onClose, parentId }: CreateFolderDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [isLoading, setIsLoading] = useState(false);
  
  const createFolder = useMutation(api.folders.createFolder);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await createFolder({
        name: name.trim(),
        parentId: parentId,
        color,
      });
      
      toast.success("Folder created successfully");
      setName("");
      setColor("#3B82F6");
      onClose();
    } catch (error) {
      toast.error("Failed to create folder");
    } finally {
      setIsLoading(false);
    }
  };

  const colors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Folder Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex space-x-2">
              {colors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === colorOption ? 'border-gray-900 dark:border-white' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => setColor(colorOption)}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}