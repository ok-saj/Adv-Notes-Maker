"use client";


import { ExportOptions } from "@/app/(root)/_components/ExportOptions";
import { FileText, Calendar, Tag } from "lucide-react";
import { Badge } from "./ui/badge";


interface NoteViewerProps {
  note: any;
}

export function NoteViewer({ note }: NoteViewerProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {note.title}
              </h1>
            </div>
            <ExportOptions title={note.title} content={note.content} />
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center space-x-2 mt-4">
              <Tag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Shared from NoteMaker</p>
        </div>
      </div>
    </div>
  );
}