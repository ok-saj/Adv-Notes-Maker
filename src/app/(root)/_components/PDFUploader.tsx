"use client";

import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


interface PDFUploaderProps {
  onTextExtracted: (text: string) => void;
}

export function PDFUploader({ onTextExtracted }: PDFUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const extractTextFromPDF = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      // Load PDF.js
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      onTextExtracted(fullText);
      setIsOpen(false);
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to extract text from PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          PDF Extract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Extract Text from PDF</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <FileText className="h-12 w-12 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Click to select PDF file
              </span>
            </label>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {selectedFile.name}
                </span>
              </div>
              <Button
                onClick={extractTextFromPDF}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  'Extract Text'
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}