import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { FileSummary } from "@/components/FileSummary";
import { DirectoryTree } from "@/components/DirectoryTree";
import { LoadingState } from "@/components/LoadingState";
import { GradeDisplay, GradeResult } from "@/components/GradeDisplay";
import { Terminal, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDirectory, setIsDirectory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);

  const handleFilesSelected = (fileList: FileList | null, isDir: boolean) => {
    if (!fileList) return;
    
    const filesArray = Array.from(fileList);
    setFiles(filesArray);
    setIsDirectory(isDir);
    setGradeResult(null);
    
    toast({
      title: "Files uploaded successfully",
      description: `${filesArray.length} file(s) ready for grading`,
    });
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload your homework files first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Create FormData to send files
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
      if (file.webkitRelativePath) {
        formData.append(`path_${index}`, file.webkitRelativePath);
      }
    });

    try {
      // TODO: Replace with your actual backend URL
      const response = await fetch('YOUR_BACKEND_URL/grade', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to grade homework');
      }

      const result: GradeResult = await response.json();
      setGradeResult(result);
    } catch (error) {
      // For demo purposes, simulate a grade result after delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setGradeResult({
        score: 85,
        maxScore: 100,
        grade: 'B+',
        feedback: 'Good work on understanding Linux commands! Your shell script demonstrates solid knowledge of file manipulation and piping. Consider adding error handling for edge cases.',
        details: [
          { category: 'File Operations', points: 20, maxPoints: 25, comment: 'Correct use of cp, mv, and rm commands' },
          { category: 'Shell Scripting', points: 25, maxPoints: 25, comment: 'Excellent script structure and logic' },
          { category: 'Permissions', points: 15, maxPoints: 20, comment: 'Good understanding of chmod, but missed setgid' },
          { category: 'Process Management', points: 15, maxPoints: 15, comment: 'Perfect use of ps, kill, and bg/fg' },
          { category: 'Documentation', points: 10, maxPoints: 15, comment: 'Add more comments to explain complex sections' },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setIsDirectory(false);
    setGradeResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  Linux Homework
                  <span className="text-gradient">AI Grader</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Upload your assignments and get instant AI-powered feedback
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-8">
            {/* Upload Zone */}
            {!gradeResult && !isLoading && (
              <section>
                <FileUploadZone 
                  onFilesSelected={handleFilesSelected}
                  disabled={isLoading}
                />
              </section>
            )}

            {/* File Summary & Directory Tree */}
            {files.length > 0 && !isLoading && !gradeResult && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <FileSummary files={files} isDirectory={isDirectory} />
                
                {isDirectory && <DirectoryTree files={files} />}

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    className="gap-2 px-8 bg-primary hover:bg-primary/90 text-primary-foreground glow"
                  >
                    <Sparkles className="w-5 h-5" />
                    Grade My Homework
                  </Button>
                </div>
              </section>
            )}

            {/* Loading State */}
            {isLoading && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <FileSummary files={files} isDirectory={isDirectory} />
                
                {isDirectory && (
                  <div className="mt-6">
                    <DirectoryTree files={files} />
                  </div>
                )}
                
                <div className="mt-6">
                  <LoadingState />
                </div>
              </section>
            )}

            {/* Grade Result */}
            {gradeResult && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <FileSummary files={files} isDirectory={isDirectory} />
                
                {isDirectory && <DirectoryTree files={files} />}
                
                <GradeDisplay result={gradeResult} />

                {/* Reset Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Grade Another Assignment
                  </Button>
                </div>
              </section>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-16">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground font-mono">
              <span className="text-primary">$</span> echo "Powered by AI" <span className="animate-terminal-blink">▋</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
