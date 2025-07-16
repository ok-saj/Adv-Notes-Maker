"use client";

import { useRef, useEffect } from "react";
import { FileText, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";


interface NoteSearchResultsProps {
  results: any[];
  onClose: () => void;
}

export function NoteSearchResults({ results, onClose }: NoteSearchResultsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const truncateContent = (content: string, maxLength: number = 100) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
  };

  return (
    <Card ref={ref} className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 border shadow-lg">
      <div className="p-2">
        {results.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No notes found
          </div>
        ) : (
          <div className="space-y-1">
            {results.map((note) => (
              <div
                key={note._id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => {
                  // Handle note selection
                  onClose();
                }}
              >
                <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {note.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {truncateContent(note.content)}
                  </div>
                  <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}