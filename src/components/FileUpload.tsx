import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';
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
      className={`relative overflow-hidden transition-all duration-300 ease-in-out
        ${isDragActive 
          ? 'border-primary bg-primary/5 scale-102' 
          : 'border-muted hover:border-primary/50 hover:bg-gray-50/50'
        } border-2 border-dashed rounded-xl p-8 text-center cursor-pointer`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <Upload className={`w-12 h-12 mx-auto transition-colors duration-300 ${
          isDragActive ? 'text-primary' : 'text-muted-foreground'
        }`} />
        {isDragActive ? (
          <div className="space-y-2 animate-fade-in">
            <p className="text-lg font-medium text-primary">Drop your PDF files here</p>
            <p className="text-sm text-muted-foreground">Files will be uploaded immediately</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-lg font-medium">Drag & drop PDF files here</p>
            <p className="text-sm text-muted-foreground">or click to select files</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
              <File className="w-4 h-4" />
              <span>Accepts PDF files</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};