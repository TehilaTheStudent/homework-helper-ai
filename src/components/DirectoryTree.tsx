import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Image, FileCode, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  path: string;
}

interface DirectoryTreeProps {
  files: File[];
}

interface TreeMap {
  [key: string]: {
    name: string;
    type: 'file' | 'folder';
    path: string;
    children?: TreeMap;
  };
}

const buildTree = (files: File[]): TreeNode[] => {
  const root: TreeMap = {};

  files.forEach(file => {
    const pathParts = file.webkitRelativePath?.split('/') || [file.name];
    let current: TreeMap = root;

    pathParts.forEach((part, index) => {
      const isFile = index === pathParts.length - 1;
      const path = pathParts.slice(0, index + 1).join('/');

      if (!current[part]) {
        current[part] = {
          name: part,
          type: isFile ? 'file' : 'folder',
          path,
          children: isFile ? undefined : {},
        };
      }

      if (!isFile && current[part].children) {
        current = current[part].children as TreeMap;
      }
    });
  });

  const convert = (obj: TreeMap): TreeNode[] => {
    return Object.values(obj).map(node => ({
      name: node.name,
      type: node.type,
      path: node.path,
      children: node.children ? convert(node.children) : undefined,
    })).sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  };

  return convert(root);
};

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  
  if (['pdf', 'doc', 'docx'].includes(ext)) return FileText;
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return Image;
  if (['txt', 'md', 'sh', 'c', 'cpp', 'py', 'java', 'js', 'ts'].includes(ext)) return FileCode;
  return File;
};

const getFileColor = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  
  if (ext === 'pdf') return 'text-terminal-cyan';
  if (['doc', 'docx'].includes(ext)) return 'text-terminal-amber';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'text-terminal-purple';
  if (['txt', 'md', 'sh', 'c', 'cpp', 'py', 'java', 'js', 'ts'].includes(ext)) return 'text-terminal-green';
  return 'text-muted-foreground';
};

const TreeNodeComponent = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const FileIcon = node.type === 'file' ? getFileIcon(node.name) : isOpen ? FolderOpen : Folder;
  const colorClass = node.type === 'file' ? getFileColor(node.name) : 'text-primary';

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer transition-colors",
          "hover:bg-secondary/80",
          node.type === 'folder' && "font-medium"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => node.type === 'folder' && setIsOpen(!isOpen)}
      >
        {node.type === 'folder' && (
          <span className="text-muted-foreground">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        {node.type === 'file' && <span className="w-4" />}
        <FileIcon className={cn("w-4 h-4", colorClass)} />
        <span className={cn("text-sm font-mono truncate", colorClass)}>
          {node.name}
        </span>
      </div>

      {node.type === 'folder' && isOpen && node.children && (
        <div className="border-l border-border/50 ml-4">
          {node.children.map((child, i) => (
            <TreeNodeComponent key={child.path + i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const DirectoryTree = ({ files }: DirectoryTreeProps) => {
  const tree = buildTree(files);

  if (tree.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/70" />
            <div className="w-3 h-3 rounded-full bg-warning/70" />
            <div className="w-3 h-3 rounded-full bg-success/70" />
          </div>
          <span className="text-sm font-mono text-muted-foreground ml-2">
            ~/homework
          </span>
        </div>
      </div>
      
      <div className="p-3 max-h-80 overflow-y-auto">
        {tree.map((node, i) => (
          <TreeNodeComponent key={node.path + i} node={node} />
        ))}
      </div>
    </div>
  );
};
