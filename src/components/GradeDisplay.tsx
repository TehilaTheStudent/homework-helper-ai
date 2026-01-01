import { CheckCircle2, AlertCircle, Info, Award, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GradeResult {
  score: number;
  maxScore: number;
  grade: string;
  feedback: string;
  details?: {
    category: string;
    points: number;
    maxPoints: number;
    comment: string;
  }[];
}

interface GradeDisplayProps {
  result: GradeResult;
}

const getGradeColor = (score: number, max: number) => {
  const percentage = (score / max) * 100;
  if (percentage >= 90) return 'text-success';
  if (percentage >= 70) return 'text-terminal-green';
  if (percentage >= 50) return 'text-terminal-amber';
  return 'text-destructive';
};

const getGradeBg = (score: number, max: number) => {
  const percentage = (score / max) * 100;
  if (percentage >= 90) return 'from-success/20 to-success/5 border-success/30';
  if (percentage >= 70) return 'from-terminal-green/20 to-terminal-green/5 border-terminal-green/30';
  if (percentage >= 50) return 'from-terminal-amber/20 to-terminal-amber/5 border-terminal-amber/30';
  return 'from-destructive/20 to-destructive/5 border-destructive/30';
};

export const GradeDisplay = ({ result }: GradeDisplayProps) => {
  const percentage = Math.round((result.score / result.maxScore) * 100);
  const gradeColor = getGradeColor(result.score, result.maxScore);
  const gradeBg = getGradeBg(result.score, result.maxScore);

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <div className={cn(
        "relative rounded-lg border bg-gradient-to-br overflow-hidden",
        gradeBg
      )}>
        <div className="absolute top-0 right-0 opacity-10">
          <Award className="w-32 h-32 -mr-8 -mt-8" />
        </div>

        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className={cn("w-5 h-5", gradeColor)} />
            <span className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Grading Complete
            </span>
          </div>

          <div className="flex items-end gap-4 mb-4">
            <div className={cn("text-6xl font-bold font-mono", gradeColor)}>
              {result.grade}
            </div>
            <div className="pb-2">
              <div className={cn("text-3xl font-bold font-mono", gradeColor)}>
                {result.score}<span className="text-muted-foreground">/{result.maxScore}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {percentage}% score
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                percentage >= 90 ? "bg-success" :
                percentage >= 70 ? "bg-terminal-green" :
                percentage >= 50 ? "bg-terminal-amber" : "bg-destructive"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="rounded-lg border border-border bg-card/50 p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <Info className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Feedback</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {result.feedback}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      {result.details && result.details.length > 0 && (
        <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">Detailed Breakdown</span>
            </div>
          </div>

          <div className="divide-y divide-border">
            {result.details.map((detail, i) => (
              <div key={i} className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{detail.category}</span>
                  <span className={cn(
                    "font-mono font-bold",
                    getGradeColor(detail.points, detail.maxPoints)
                  )}>
                    {detail.points}/{detail.maxPoints}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{detail.comment}</p>
                <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      (detail.points / detail.maxPoints) >= 0.7 ? "bg-success" : 
                      (detail.points / detail.maxPoints) >= 0.5 ? "bg-terminal-amber" : "bg-destructive"
                    )}
                    style={{ width: `${(detail.points / detail.maxPoints) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
