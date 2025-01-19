export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface DocumentShare {
  id: string;
  email: string;
  accessLevel: 'view' | 'edit';
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  lastModified: number;
  favorite?: boolean;
  tags?: Tag[];
  shares?: DocumentShare[];
  content?: string;
}