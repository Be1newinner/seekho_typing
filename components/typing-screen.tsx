"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { compareTexts, calculateStats, formatTime, type TypingStats } from "@/lib/typing-utils";
import { ResultSummary } from "@/components/result-summary";
import { cn } from "@/lib/utils";
import { Keyboard } from "lucide-react";

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

  const effectiveTargetText = unlimitedMode
    ? Array(repeatCount).fill(targetText).join(" ")
    : targetText;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus input on click
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = prev + 1;
          if (timeLimit && newTime >= timeLimit) finishTest();
          return newTime;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isStarted, isFinished, timeLimit]);

  const finishTest = useCallback(() => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const finalStats = calculateStats(effectiveTargetText, typedText, timeElapsed || 1);
    setStats(finalStats);
    onComplete?.(finalStats);
  }, [effectiveTargetText, typedText, timeElapsed, onComplete]);

  useEffect(() => {
    if (isStarted && !isFinished) {
      if (unlimitedMode) {
        if (typedText.length >= effectiveTargetText.length - 100) setRepeatCount((prev) => prev + 1);
      } else {
        if (typedText.length >= effectiveTargetText.length) finishTest();
      }
    }
  }, [typedText, effectiveTargetText, isStarted, isFinished, finishTest, unlimitedMode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (noBackspace && (e.key === "Backspace" || e.key === "Delete")) e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    if (!isStarted) setIsStarted(true);
    setTypedText(e.target.value);
  };

  const handleRestart = () => {
    setTypedText(""); setIsFinished(false); setIsStarted(false);
    setTimeElapsed(0); setStats(null); setRepeatCount(1);
    if (timerRef.current) clearInterval(timerRef.current);
    onRestart?.();
    setTimeout(() => {
      inputRef.current?.focus();
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // Auto-scroll to caret
  useEffect(() => {
    if (caretRef.current && scrollContainerRef.current) {
      caretRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [typedText]);

  const handleFinish = () => { if (typedText.length > 0) finishTest(); };

  const comparison = compareTexts(effectiveTargetText, typedText);
  const timeDisplay = timeLimit ? formatTime(Math.max(0, timeLimit - timeElapsed)) : formatTime(timeElapsed);

  const liveStats = isStarted && timeElapsed > 0
    ? calculateStats(effectiveTargetText.slice(0, typedText.length), typedText, timeElapsed)
    : null;

  const renderTargetText = () => {
    const displayText = unlimitedMode
      ? effectiveTargetText.slice(Math.max(0, typedText.length - 200), typedText.length + 500)
      : effectiveTargetText;
    const displayOffset = unlimitedMode ? Math.max(0, typedText.length - 200) : 0;

    return displayText.split("").map((char: string, i: number) => {
      const idx = i + displayOffset;
      const comp = comparison[idx];
      let colorClass = "text-muted-foreground/30";
      let bgClass = "";
      let isCaret = idx === typedText.length;

      if (comp) {
        if (comp.status === "correct") colorClass = "text-foreground";
        else if (comp.status === "incorrect") {
          colorClass = "text-destructive";
          bgClass = "bg-destructive/10 rounded-sm";
        }
      }

      return (
        <span
          key={idx}
          ref={isCaret ? caretRef : null}
          className={cn("relative transition-colors duration-200", colorClass, bgClass)}
        >
          {char === " " ? "\u00A0" : char}
          {isCaret && !isFinished && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[1.2em] bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
          )}
        </span>
      );
    });
  };

  if (isFinished && stats) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ResultSummary stats={stats} targetText={targetText} typedText={typedText} title={title} />
        <div className="flex flex-wrap gap-4">
          <Button onClick={handleRestart} size="lg" className="rounded-full px-8 font-bold shadow-xl shadow-primary/20">
            Try Again
          </Button>
          {showNext && onNext && (
            <Button onClick={onNext} variant="outline" size="lg" className="rounded-full px-8 font-bold border-primary/20 text-primary hover:bg-primary/5">
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-6">
        {title && (
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="no-backspace" checked={noBackspace} onCheckedChange={setNoBackspace} />
            <Label htmlFor="no-backspace" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer">
              No Backspace
            </Label>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRestart} className="text-muted-foreground hover:text-primary rounded-full px-4">
            Restart
          </Button>
        </div>
      </div>

      {/* Stats HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Time", value: timeDisplay, sub: timeLimit ? "Remaining" : "Elapsed" },
          { label: "WPM", value: liveStats?.grossWPM || 0, sub: "Gross" },
          { label: "Accuracy", value: `${liveStats?.accuracy.toFixed(0) || 0}%`, sub: "Success" },
          { label: "Characters", value: typedText.length, sub: "Typed" }
        ].map((stat, i) => (
          <Card key={i} className="border-none bg-white/50 dark:bg-white/5 backdrop-blur-md p-4 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-bold mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-primary">{stat.value}</span>
              <span className="text-[10px] font-semibold text-muted-foreground/60">{stat.sub}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Typing Workspace */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className="relative group cursor-text"
      >
        <Card
          ref={scrollContainerRef}
          className="p-4 md:p-6 border-none bg-white dark:bg-white/5 shadow-2xl shadow-primary/5 min-h-[200px] max-h-[500px] flex items-center justify-start overflow-auto scrollbar-none transition-all"
        >
          <div className="w-full">
            <p className="text-3xl md:text-5xl leading-none font-medium tracking-wider font-mono whitespace-nowrap relative z-10 py-40 px-[50%] transition-all">
              {renderTargetText()}
            </p>
          </div>

          {/* Decorative background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none flex items-center justify-center">
            <Keyboard className="w-64 h-64 text-primary" />
          </div>
        </Card>

        {/* Hidden Input */}
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isFinished}
          className="absolute inset-0 w-full h-full opacity-0 cursor-default resize-none"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        {!isStarted && !isFinished && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary animate-pulse">
              Click & Start Typing
            </p>
          </div>
        )}
      </div>

      {/* Finish Button (Optional) */}
      {!isFinished && typedText.length > 0 && unlimitedMode && (
        <div className="flex justify-center pt-4">
          <Button variant="secondary" onClick={handleFinish} className="rounded-full px-12 font-bold shadow-lg shadow-black/5">
            End Practice Session
          </Button>
        </div>
      )}
    </div>
  );
}
