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
    '#000000', '#EF4444', '#F97316', '#F59E0B', '#84CC16', 
    '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'
  ];

  const highlightColors = [
    '#FEF3C7', '#FEE2E2', '#DBEAFE', '#D1FAE5', '#E5E7EB',
    '#F3E8FF', '#FCE7F3', '#FEF2F2', '#ECFDF5', '#EFF6FF'
  ];

  return (
    <div className="border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-1">
      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Font Family */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Type className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {fontFamilies.map((font) => (
            <DropdownMenuItem
              key={font.value}
              onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
            >
              <span style={{ fontFamily: font.value }}>{font.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Size */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            Size
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {fontSizes.map((size) => (
            <DropdownMenuItem
              key={size.value}
              onClick={() => editor.chain().focus().setFontSize(size.value).run()}
            >
              {size.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      {/* Text Color */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="grid grid-cols-5 gap-1 p-2">
            {colors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
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
          <Button variant="ghost" size="sm">
            <Highlighter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="grid grid-cols-5 gap-1 p-2">
            {highlightColors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setHighlight({ color }).run()}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Alignment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Lists */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Other Elements */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        <Quote className="h-4 w-4" />
      </Button>

      {/* Link */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <Link className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <Input
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <Button onClick={setLink} className="w-full">
              Add Link
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Image */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <Image className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <Input
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button onClick={addImage} className="w-full">
              Add Image
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}