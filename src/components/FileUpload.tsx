import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const FileUpload = ({ onUpload }: { onUpload: (files: File[]) => void }) => {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== acceptedFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are allowed",
        variant: "destructive"
      });
      return;
    }
    onUpload(pdfFiles);
  }, [onUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      {isDragActive ? (
        <p className="text-lg">Drop your PDF files here...</p>
      ) : (
        <div>
          <p className="text-lg mb-2">Drag & drop PDF files here</p>
          <p className="text-sm text-muted-foreground">or click to select files</p>
        </div>
      )}
    </div>
  );
};