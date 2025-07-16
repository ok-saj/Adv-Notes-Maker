"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import jsPDF from 'jspdf';
import toast from "react-hot-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ExportOptionsProps {
  title: string;
  content: string;
}

export function ExportOptions({ title, content }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(title, 20, 20);
      
      // Add content (strip HTML tags for plain text)
      const plainText = content.replace(/<[^>]*>/g, '');
      doc.setFontSize(12);
      
      // Split text into lines to fit page width
      const lines = doc.splitTextToSize(plainText, 170);
      let yPosition = 40;
      
      lines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 7;
      });
      
      doc.save(`${title}.pdf`);
      toast.success("PDF exported successfully");
    } catch (error) {
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsText = () => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const blob = new Blob([`${title}\n\n${plainText}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Text file exported successfully");
  };

  const exportAsHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div>${content}</div>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("HTML file exported successfully");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportAsPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsText}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsHTML}>
          <FileText className="h-4 w-4 mr-2" />
          Export as HTML
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}