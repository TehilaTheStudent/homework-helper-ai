import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const loadingMessages = [
  "Analyzing file structure...",
  "Scanning for syntax errors...",
  "Checking command usage...",
  "Evaluating shell scripts...",
  "Grading your homework...",
  "Almost there...",
];

export const LoadingState = () => {
  return (
    <div className="relative rounded-lg border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan opacity-50" />
      </div>

      <div className="px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-terminal-amber animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-terminal-amber/50" />
            <div className="w-3 h-3 rounded-full bg-muted" />
          </div>
          <span className="text-sm font-mono text-muted-foreground ml-2">
            AI Grader — Processing
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-glow rounded-full" />
            <div className="relative p-4 rounded-full bg-secondary border border-primary/30">
              <Terminal className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-2 font-mono text-sm">
          {loadingMessages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 transition-all duration-500",
                i < 3 ? "text-terminal-green" : "text-muted-foreground"
              )}
              style={{
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <span className={cn(
                "text-primary",
                i === 3 && "animate-terminal-blink"
              )}>
                {i < 3 ? "✓" : i === 3 ? ">" : "○"}
              </span>
              <span className={cn(i === 3 && "animate-pulse")}>
                {msg}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-4">
          <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-terminal-green to-primary rounded-full animate-shimmer"
              style={{
                width: '60%',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground">Processing...</span>
        </div>
      </div>
    </div>
  );
};
