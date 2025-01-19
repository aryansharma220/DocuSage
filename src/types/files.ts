export interface FileItem {
  id: string;
  name: string;
  size: number;
  lastModified: number;
  content?: string;
}