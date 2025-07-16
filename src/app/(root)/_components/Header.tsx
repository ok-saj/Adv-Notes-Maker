"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { Menu, Search, FileText } from "lucide-react";
import { NoteSearchResults } from "./NoteSearchResults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../../../convex/_generated/api";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchResults = useQuery(
    api.notes.searchNotes,
    searchQuery.trim() ? { query: searchQuery.trim() } : "skip"
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  return (
    <header className="glass border-b border-border/50 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden hover:bg-muted/50"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-20"></div>
              <div className="relative bg-primary/10 p-2 rounded-xl">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NoteMaker
              </h1>
              <p className="text-xs text-muted-foreground">Professional Notes</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
              className="pl-10 w-64 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
            {showSearchResults && (
              <NoteSearchResults
                results={searchResults || []}
                onClose={() => setShowSearchResults(false)}
              />
            )}
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-20"></div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 relative",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}