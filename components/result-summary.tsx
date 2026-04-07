"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime, getWrongWordIndices, type TypingStats } from "@/lib/typing-utils";

interface ResultSummaryProps {
  stats: TypingStats;
  targetText: string;
  typedText: string;
  title?: string;
  examMode?: boolean;
}

export function ResultSummary({ 
  stats, 
  targetText, 
  typedText, 
  title,
  examMode = false 
}: ResultSummaryProps) {
  const wrongWordIndices = getWrongWordIndices(targetText, typedText);
  const targetWords = targetText.split(/\s+/).filter(w => w.length > 0);

  // Render target text with wrong words highlighted
  const renderHighlightedText = () => {
    let wordIndex = 0;
    const parts = targetText.split(/(\s+)/);
    
    return parts.map((part, idx) => {
      if (/^\s+$/.test(part)) {
        return <span key={idx}>{part}</span>;
      }
      
      const isWrong = wrongWordIndices.has(wordIndex);
      wordIndex++;
      
      return (
        <span
          key={idx}
          className={isWrong ? "bg-red-200 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-0.5 rounded" : ""}
        >
          {part}
        </span>
      );
    });
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return "text-green-600 dark:text-green-400";
    if (accuracy >= 85) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getSpeedColor = (wpm: number) => {
    if (wpm >= 40) return "text-green-600 dark:text-green-400";
    if (wpm >= 25) return "text-yellow-600 dark:text-yellow-400";
    return "text-foreground";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {examMode ? "Exam Result" : "Result Summary"}
            {title && <span className="text-muted-foreground font-normal"> - {title}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="text-2xl font-bold text-foreground">
                {formatTime(stats.timeElapsedSeconds)}
              </p>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className={`text-2xl font-bold ${getAccuracyColor(stats.accuracy)}`}>
                {stats.accuracy}%
              </p>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Gross WPM</p>
              <p className={`text-2xl font-bold ${getSpeedColor(stats.grossWPM)}`}>
                {stats.grossWPM}
              </p>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Net WPM</p>
              <p className={`text-2xl font-bold ${getSpeedColor(stats.netWPM)}`}>
                {stats.netWPM}
              </p>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Characters</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.correctCharacters}
                <span className="text-base text-muted-foreground">/{stats.totalCharacters}</span>
              </p>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Errors</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.incorrectCharacters}
              </p>
            </div>
          </div>
          
          {/* Progress hint */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            {stats.accuracy >= 95 ? (
              <p className="text-sm text-green-600 dark:text-green-400">
                Excellent! Great accuracy. Focus on increasing your speed.
              </p>
            ) : stats.accuracy >= 85 ? (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Good job! Try to reach 95%+ accuracy before pushing for higher speed.
              </p>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">
                Keep practicing! Focus on accuracy first, speed will follow.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Highlighted text with errors */}
      {wrongWordIndices.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Text with Errors Highlighted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed font-mono whitespace-pre-wrap">
              {renderHighlightedText()}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Wrong words list */}
      {stats.wrongWords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Mistakes ({stats.wrongWords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {stats.wrongWords.map((word, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 p-2 bg-muted rounded text-sm font-mono"
                >
                  <span className="text-green-600 dark:text-green-400 flex-1 truncate">
                    {word.expected}
                  </span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="text-red-600 dark:text-red-400 flex-1 truncate">
                    {word.typed}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
