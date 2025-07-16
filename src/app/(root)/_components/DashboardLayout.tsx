"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Id } from "../../../../convex/_generated/dataModel";

interface DashboardLayoutProps {
  children: React.ReactNode;
  selectedFolderId: Id<"folders"> | undefined;
  onFolderSelect: (folderId: Id<"folders"> | undefined) => void;
  selectedNoteId: Id<"notes"> | null;
  onNoteSelect: (noteId: Id<"notes"> | null) => void;
  notes: any[];
}

export function DashboardLayout({
  children,
  selectedFolderId,
  onFolderSelect,
  selectedNoteId,
  onNoteSelect,
  notes,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen bg-gradient-to-br from-background via-muted/10 to-background flex flex-col">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          selectedFolderId={selectedFolderId}
          onFolderSelect={onFolderSelect}
          selectedNoteId={selectedNoteId}
          onNoteSelect={onNoteSelect}
          notes={notes}
        />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}