import { useState, useCallback } from "react";
import { Upload, FolderOpen, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFilesSelected: (files: FileList | null, isDirectory: boolean) => void;
  disabled?: boolean;
}

export const FileUploadZone = ({ onFilesSelected, disabled }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files, false);
    }
  }, [disabled, onFilesSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files, false);
    }
  };

  const handleDirectoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files, true);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-12 transition-all duration-300",
        "bg-card/50 backdrop-blur-sm",
        isDragging 
          ? "border-primary bg-primary/5 scale-[1.02]" 
          : "border-border hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse-glow" />
      )}
      
      <div className="relative flex flex-col items-center gap-6 text-center">
        <div className="p-4 rounded-full bg-secondary border border-border">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Drop your homework files here
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Supports <span className="text-terminal-cyan font-mono">.pdf</span>,{" "}
            <span className="text-terminal-amber font-mono">.docx</span>,{" "}
            <span className="text-terminal-green font-mono">.txt</span>,{" "}
            <span className="text-terminal-purple font-mono">images</span>, and{" "}
            <span className="text-primary font-mono">directories</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <label className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all",
            "bg-primary text-primary-foreground font-medium",
            "hover:bg-primary/90 hover:scale-105",
            disabled && "pointer-events-none"
          )}>
            <File className="w-4 h-4" />
            Select Files
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              disabled={disabled}
              accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.gif,.webp"
            />
          </label>

          <label className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all",
            "bg-secondary text-secondary-foreground font-medium border border-border",
            "hover:bg-secondary/80 hover:border-primary/50 hover:scale-105",
            disabled && "pointer-events-none"
          )}>
            <FolderOpen className="w-4 h-4" />
            Select Directory
            <input
              type="file"
              className="hidden"
              onChange={handleDirectoryInput}
              disabled={disabled}
              {...{ webkitdirectory: "", directory: "" } as any}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
