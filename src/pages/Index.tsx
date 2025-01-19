import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { FileGrid } from '@/components/FileGrid';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send } from 'lucide-react';
import { analyzeDocuments } from '@/services/ai';

interface FileItem {
  id: string;
  name: string;
  size: number;
  lastModified: number;
  content?: string;
}

const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [question, setQuestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (uploadedFiles: File[]) => {
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

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        description: "Your question cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const answer = await analyzeDocuments(question, files);
      toast({
        title: "AI Response",
        description: answer,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze documents",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setQuestion('');
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Smart Document Manager</h1>
          <p className="text-muted-foreground">Upload, search, and analyze your documents with AI assistance</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Ask AI Assistant</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Ask a question about your documents..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1"
                disabled={isAnalyzing}
              />
              <Button 
                onClick={handleAskQuestion}
                disabled={isAnalyzing}
              >
                <Send className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Ask'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Search Documents</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upload Documents</h2>
          <FileUpload onUpload={handleUpload} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Documents</h2>
          <FileGrid 
            files={filteredFiles}
            onFileSelect={handleFileSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;