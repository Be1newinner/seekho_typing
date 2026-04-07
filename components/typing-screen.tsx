"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { compareTexts, calculateStats, formatTime, type TypingStats } from "@/lib/typing-utils";
import { ResultSummary } from "@/components/result-summary";

interface TypingScreenProps {
  targetText: string;
  title?: string;
  timeLimit?: number; // in seconds, undefined means no limit
  unlimitedMode?: boolean; // content keeps repeating, no auto-finish
  onComplete?: (stats: TypingStats) => void;
  onRestart?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  showNext?: boolean;
  defaultNoBackspace?: boolean;
}

export function TypingScreen({
  targetText,
  title,
  timeLimit,
  unlimitedMode = false,
  onComplete,
  onRestart,
  onNext,
  nextLabel = "Next",
  showNext = false,
  defaultNoBackspace = false,
}: TypingScreenProps) {
  const [typedText, setTypedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [noBackspace, setNoBackspace] = useState(defaultNoBackspace);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [stats, setStats] = useState<TypingStats | null>(null);
  const [repeatCount, setRepeatCount] = useState(1);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // In unlimited mode, repeat the target text
  const effectiveTargetText = unlimitedMode 
    ? Array(repeatCount).fill(targetText).join(" ")
    : targetText;

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = prev + 1;
          // Check if time limit reached
          if (timeLimit && newTime >= timeLimit) {
            finishTest();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, isFinished, timeLimit]);

  const finishTest = useCallback(() => {
    setIsFinished(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const finalStats = calculateStats(effectiveTargetText, typedText, timeElapsed || 1);
    setStats(finalStats);
    onComplete?.(finalStats);
  }, [effectiveTargetText, typedText, timeElapsed, onComplete]);

  // Check if typing is complete or needs more content in unlimited mode
  useEffect(() => {
    if (isStarted && !isFinished) {
      if (unlimitedMode) {
        // In unlimited mode, add more content when user gets close to the end
        if (typedText.length >= effectiveTargetText.length - 100) {
          setRepeatCount((prev) => prev + 1);
        }
      } else {
        // Normal mode - finish when done
        if (typedText.length >= effectiveTargetText.length) {
          finishTest();
        }
      }
    }
  }, [typedText, effectiveTargetText, isStarted, isFinished, finishTest, unlimitedMode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (noBackspace && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    
    if (!isStarted) {
      setIsStarted(true);
    }
    
    setTypedText(e.target.value);
  };

  const handleRestart = () => {
    setTypedText("");
    setIsFinished(false);
    setIsStarted(false);
    setTimeElapsed(0);
    setStats(null);
    setRepeatCount(1);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onRestart?.();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleFinish = () => {
    if (typedText.length > 0) {
      finishTest();
    }
  };

  const comparison = compareTexts(effectiveTargetText, typedText);
  const timeDisplay = timeLimit 
    ? formatTime(Math.max(0, timeLimit - timeElapsed))
    : formatTime(timeElapsed);
  
  // Calculate live stats for unlimited mode
  const liveStats = isStarted && unlimitedMode && timeElapsed > 0
    ? calculateStats(effectiveTargetText.slice(0, typedText.length), typedText, timeElapsed)
    : null;

  // Split target into words for highlighting
  const renderTargetText = () => {
    let charIndex = 0;
    // Only show a portion of text in unlimited mode to avoid performance issues
    const displayText = unlimitedMode 
      ? effectiveTargetText.slice(Math.max(0, typedText.length - 200), typedText.length + 500)
      : effectiveTargetText;
    const displayOffset = unlimitedMode ? Math.max(0, typedText.length - 200) : 0;
    const words = displayText.split(/(\s+)/);
    
    return words.map((word, wordIdx) => {
      const wordStart = charIndex;
      const wordChars = word.split("").map((char, idx) => {
        const globalIdx = wordStart + idx + displayOffset;
        const comp = comparison[globalIdx];
        let className = "text-muted-foreground";
        
        if (comp) {
          if (comp.status === "correct") {
            className = "text-foreground";
          } else if (comp.status === "incorrect") {
            className = "text-red-500 bg-red-100 dark:bg-red-900/30";
          } else if (comp.status === "current") {
            className = "bg-primary/20 text-foreground border-b-2 border-primary";
          }
        }
        
        return (
          <span key={globalIdx} className={className}>
            {char === " " ? "\u00A0" : char}
          </span>
        );
      });
      
      charIndex += word.length;
      return <span key={wordIdx}>{wordChars}</span>;
    });
  };

  if (isFinished && stats) {
    return (
      <div className="space-y-6">
        <ResultSummary 
          stats={stats} 
          targetText={targetText}
          typedText={typedText}
          title={title}
        />
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleRestart} size="lg">
            Try Again
          </Button>
          {showNext && onNext && (
            <Button onClick={onNext} variant="outline" size="lg">
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      )}
      
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
          <span className="font-mono text-lg font-bold text-foreground">
            {timeDisplay}
          </span>
          <span className="text-muted-foreground">
            {timeLimit ? "remaining" : "elapsed"}
          </span>
        </div>
        
        {/* Live stats for unlimited mode */}
        {liveStats && (
          <>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
              <span className="font-mono text-lg font-bold text-foreground">
                {liveStats.grossWPM}
              </span>
              <span className="text-muted-foreground">WPM</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
              <span className="font-mono text-lg font-bold text-foreground">
                {liveStats.accuracy.toFixed(0)}%
              </span>
              <span className="text-muted-foreground">accuracy</span>
            </div>
          </>
        )}
        
        <div className="flex items-center gap-2">
          <Switch
            id="no-backspace"
            checked={noBackspace}
            onCheckedChange={setNoBackspace}
          />
          <Label htmlFor="no-backspace" className="text-sm cursor-pointer">
            Disable Backspace
          </Label>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleRestart}>
          Restart
        </Button>
        
        {!isFinished && typedText.length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleFinish}>
            {unlimitedMode ? "End Practice" : "Finish"}
          </Button>
        )}
      </div>

      {/* Target Text */}
      <Card className="p-4 bg-muted/50">
        <p className="text-lg leading-relaxed font-mono whitespace-pre-wrap break-words">
          {renderTargetText()}
        </p>
      </Card>

      {/* Typing Input */}
      <div>
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isFinished}
          placeholder="Start typing here..."
          className="w-full min-h-[150px] p-4 text-lg font-mono rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
      
      {/* Progress hint */}
      {isStarted && (
        <p className="text-sm text-muted-foreground">
          {unlimitedMode 
            ? `${typedText.length} characters typed`
            : `${typedText.length} / ${effectiveTargetText.length} characters typed`
          }
        </p>
      )}
    </div>
  );
}
