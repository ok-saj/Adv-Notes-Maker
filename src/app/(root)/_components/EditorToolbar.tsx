"use client";

import { Editor } from '@tiptap/react';
import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Palette,
  Type,
  Highlighter,
  Undo,
  Redo,
  Code,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (!editor) return null;

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
  };

  const fontSizes = [
    { label: 'Small', value: '12px' },
    { label: 'Normal', value: '14px' },
    { label: 'Medium', value: '16px' },
    { label: 'Large', value: '18px' },
    { label: 'Extra Large', value: '24px' },
  ];

  const fontFamilies = [
    { label: 'Default', value: 'Inter' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' },
  ];

  const colors = [
    '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
    '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  const highlightColors = [
    '#fef3c7', '#fee2e2', '#dbeafe', '#d1fae5', '#e5e7eb',
    '#f3e8ff', '#fce7f3', '#fef2f2', '#ecfdf5', '#eff6ff'
  ];

  return (
    <div className="border-b border-border/50 p-3 flex flex-wrap gap-1 bg-muted/20 backdrop-blur-sm">
      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="hover:bg-primary/10 hover:text-primary transition-colors"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="hover:bg-primary/10 hover:text-primary transition-colors"
      >
        <Redo className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border/50 mx-2" />

      {/* Font Family */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
            <Type className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass">
          {fontFamilies.map((font) => (
            <DropdownMenuItem
              key={font.value}
              onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <span style={{ fontFamily: font.value }}>{font.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Size */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
            Size
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass">
          {fontSizes.map((size) => (
            <DropdownMenuItem
              key={size.value}
              onClick={() => editor.chain().focus().setFontSize(size.value).run()}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {size.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-border/50 mx-2" />

      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`transition-colors ${editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 hover:text-primary'}`}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`transition-colors ${editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 hover:text-primary'}`}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`transition-colors ${editor.isActive('underline') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 hover:text-primary'}`}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`transition-colors ${editor.isActive('strike') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 hover:text-primary'}`}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      {/* Text Color */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass">
          <div className="grid grid-cols-5 gap-2 p-3">
            {colors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-lg border border-border/50 hover:scale-110 transition-transform shadow-sm"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setColor(color).run()}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Highlight */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
            <Highlighter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass">
          <div className="grid grid-cols-5 gap-2 p-3">
            {highlightColors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-lg border border-border/50 hover:scale-110 transition-transform shadow-sm"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setHighlight({ color }).run()}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-border/50 mx-2" />

      {/* Alignment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 hover:text-primary'}`}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 hover:text-primary'}`}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 hover:text-primary'}`}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border/50 mx-2" />

      {/* Lists */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`transition-colors ${editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 hover:text-primary'}`}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`transition-colors ${editor.isActive('orderedList') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 hover:text-primary'}`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border/50 mx-2" />

      {/* Other Elements */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`transition-colors ${editor.isActive('code') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 hover:text-primary'}`}
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`transition-colors ${editor.isActive('blockquote') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 hover:text-primary'}`}
      >
        <Quote className="h-4 w-4" />
      </Button>

      {/* Link */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
            <Link className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="glass">
          <div className="space-y-3">
            <Input
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="bg-muted/50 border-border/50"
            />
            <Button onClick={setLink} className="w-full bg-primary hover:bg-primary/90">
              Add Link
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Image */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
            <Image className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="glass">
          <div className="space-y-3">
            <Input
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-muted/50 border-border/50"
            />
            <Button onClick={addImage} className="w-full bg-primary hover:bg-primary/90">
              Add Image
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}