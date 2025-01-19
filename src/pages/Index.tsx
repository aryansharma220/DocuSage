import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { FileGrid } from '@/components/FileGrid';
import { useToast } from "@/hooks/use-toast";

interface FileItem {
  id: string;
  name: string;
  size: number;
  lastModified: number;
}

const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => {
    const newFiles = uploadedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      lastModified: file.lastModified
    }));

    setFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Files uploaded successfully",
      description: `${uploadedFiles.length} file${uploadedFiles.length === 1 ? '' : 's'} uploaded`,
    });
  };

  const handleFileSelect = (file: FileItem) => {
    toast({
      title: "File selected",
      description: `Selected ${file.name}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">PDF Manager</h1>
      
      <div className="mb-8">
        <FileUpload onUpload={handleUpload} />
      </div>

      <FileGrid 
        files={files}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
};

export default Index;