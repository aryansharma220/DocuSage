import { FileText, Search, Grid, List, Star, Share2, Tag, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileItem, Tag as TagType } from '@/types/documents';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface FileGridProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  onToggleFavorite?: (file: FileItem) => void;
}

const tagColors = [
  'bg-red-100 text-red-800',
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
];

export const FileGrid = ({ files, onFileSelect, onToggleFavorite }: FileGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const renderTags = (tags?: TagType[]) => {
    if (!tags?.length) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map((tag, index) => (
          <span
            key={tag.id}
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              tagColors[index % tagColors.length]
            )}
          >
            {tag.name}
          </span>
        ))}
      </div>
    );
  };

  const renderFileCard = (file: FileItem) => {
    const cardContent = (
      <>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FileText className="h-8 w-8 text-blue-600" />
            {file.favorite && (
              <Star className="h-4 w-4 text-yellow-400 absolute -top-2 -right-2 fill-current" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)} • {formatDate(file.lastModified)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {file.shares?.length ? (
              <HoverCard>
                <HoverCardTrigger>
                  <Share2 className="h-4 w-4 text-gray-500" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Shared with:</h4>
                    {file.shares.map(share => (
                      <div key={share.id} className="text-xs">
                        {share.email} ({share.accessLevel})
                      </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(file);
              }}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  file.favorite ? "text-yellow-400 fill-current" : "text-gray-400"
                )}
              />
            </Button>
          </div>
        </div>
        {renderTags(file.tags)}
      </>
    );

    return viewMode === 'grid' ? (
      <div
        key={file.id}
        className="file-card cursor-pointer group hover:scale-102 transition-all duration-200"
        onClick={() => onFileSelect(file)}
      >
        {cardContent}
      </div>
    ) : (
      <div
        key={file.id}
        className="file-card cursor-pointer flex items-center gap-4 group hover:scale-101 transition-all duration-200"
        onClick={() => onFileSelect(file)}
      >
        {cardContent}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search files..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="file-grid">
          {filteredFiles.map(renderFileCard)}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map(renderFileCard)}
        </div>
      )}

      {filteredFiles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No files found
        </div>
      )}
    </div>
  );
};