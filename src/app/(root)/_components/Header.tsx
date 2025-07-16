"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { Menu, Moon, Sun, Search, FileText } from "lucide-react";
import { NoteSearchResults } from "./NoteSearchResults";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../../../convex/_generated/api";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();
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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              NoteMaker
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
              className="pl-10 w-64"
            />
            {showSearchResults && (
              <NoteSearchResults
                results={searchResults || []}
                onClose={() => setShowSearchResults(false)}
              />
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}