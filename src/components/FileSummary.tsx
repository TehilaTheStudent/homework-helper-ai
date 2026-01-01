import { FileText, Image, FileCode, Folder, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileSummaryProps {
  files: File[];
  isDirectory: boolean;
}

interface FileStats {
  total: number;
  pdfs: number;
  docx: number;
  images: number;
  text: number;
  other: number;
}

const getFileStats = (files: File[]): FileStats => {
  const stats: FileStats = { total: 0, pdfs: 0, docx: 0, images: 0, text: 0, other: 0 };
  
  files.forEach(file => {
    stats.total++;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (ext === 'pdf') stats.pdfs++;
    else if (['docx', 'doc'].includes(ext)) stats.docx++;
    else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].includes(ext)) stats.images++;
    else if (['txt', 'md', 'sh', 'bash', 'c', 'cpp', 'py', 'java'].includes(ext)) stats.text++;
    else stats.other++;
  });
  
  return stats;
};

const StatCard = ({ 
  icon: Icon, 
  label, 
  count, 
  colorClass 
}: { 
  icon: React.ElementType; 
  label: string; 
  count: number;
  colorClass: string;
}) => (
  <div className={cn(
    "flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border",
    "transition-all hover:scale-105 hover:border-primary/30"
  )}>
    <div className={cn("p-2 rounded-md", colorClass)}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-bold font-mono text-foreground">{count}</p>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

export const FileSummary = ({ files, isDirectory }: FileSummaryProps) => {
  const stats = getFileStats(files);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-sm font-mono text-muted-foreground px-2">
          {isDirectory ? "Directory Contents" : "Upload Summary"}
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard 
          icon={isDirectory ? Folder : File} 
          label="Total Files" 
          count={stats.total}
          colorClass="bg-primary/20 text-primary"
        />
        <StatCard 
          icon={FileText} 
          label="PDFs" 
          count={stats.pdfs}
          colorClass="bg-terminal-cyan/20 text-terminal-cyan"
        />
        <StatCard 
          icon={FileText} 
          label="DOCX" 
          count={stats.docx}
          colorClass="bg-terminal-amber/20 text-terminal-amber"
        />
        <StatCard 
          icon={Image} 
          label="Images" 
          count={stats.images}
          colorClass="bg-terminal-purple/20 text-terminal-purple"
        />
        <StatCard 
          icon={FileCode} 
          label="Text/Code" 
          count={stats.text}
          colorClass="bg-terminal-green/20 text-terminal-green"
        />
        <StatCard 
          icon={File} 
          label="Other" 
          count={stats.other}
          colorClass="bg-muted text-muted-foreground"
        />
      </div>
    </div>
  );
};
