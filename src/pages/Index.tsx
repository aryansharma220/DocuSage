import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { FileGrid } from '@/components/FileGrid';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Upload, FileText } from 'lucide-react';
import { analyzeDocuments } from '@/services/ai';
import { FileItem } from '@/types/files';

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

    if (files.length === 0) {
      toast({
        title: "No documents available",
        description: "Please upload some PDF files first",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Smart Document Manager
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your PDFs, search through them, and ask questions about their content using AI assistance
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                <Send className="h-5 w-5" />
                <h2>Ask AI Assistant</h2>
              </div>
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
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Ask'}
                </Button>
              </div>
            </div>

            <div className="space-y-4 p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                <Search className="h-5 w-5" />
                <h2>Search Documents</h2>
              </div>
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

          <div className="space-y-4 p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <Upload className="h-5 w-5" />
              <h2>Upload Documents</h2>
            </div>
            <FileUpload onUpload={handleUpload} />
          </div>

          <div className="space-y-4 p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <FileText className="h-5 w-5" />
              <h2>Your Documents</h2>
            </div>
            <FileGrid 
              files={filteredFiles}
              onFileSelect={handleFileSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;