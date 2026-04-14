"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypingScreen } from "@/components/typing-screen";
import { lessons, type Lesson } from "@/lib/typing-data";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check } from "lucide-react";

export function LessonsSection() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [randomMode, setRandomMode] = useState(false);

  const generateRandomText = (originalText: string) => {
    const chars = Array.from(new Set(originalText.replace(/\s/g, "").split("")));
    let result = "";
    for (let i = 0; i < 20; i++) {
        let word = "";
        const wordLen = 3 + Math.floor(Math.random() * 4);
        for (let j = 0; j < wordLen; j++) {
            word += chars[Math.floor(Math.random() * chars.length)];
        }
        result += word + " ";
    }
    return result.trim();
  };

  const lessonText = selectedLesson 
    ? (randomMode ? generateRandomText(selectedLesson.text) : selectedLesson.text)
    : "";

  const handleComplete = () => {
    if (selectedLesson) {
      setCompletedLessons((prev) => new Set([...prev, selectedLesson.id]));
    }
  };

  const handleNextLesson = () => {
    if (selectedLesson) {
      const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
      const nextLesson = lessons[currentIndex + 1];
      if (nextLesson) {
        setSelectedLesson(nextLesson);
      } else {
        setSelectedLesson(null);
      }
    }
  };

  if (selectedLesson) {
    const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
    const hasNextLesson = currentIndex < lessons.length - 1;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedLesson(null)}
          className="gap-2 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/5 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-semibold text-xs uppercase tracking-widest">Back to Gallery</span>
        </Button>
        
        <TypingScreen
          targetText={lessonText}
          title={selectedLesson.title + (randomMode ? " (Randomized)" : "")}
          unlimitedMode={true}
          onComplete={handleComplete}
          onNext={handleNextLesson}
          showNext={hasNextLesson}
          nextLabel="Next Lesson"
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Typing Lessons</h2>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            The foundation of mastery. Complete these <span className="text-primary font-bold">20 core lessons</span> to achieve 60+ WPM touch typing proficiency.
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-surface-low rounded-2xl border border-border/10">
          <div className="flex items-center gap-2">
            <Switch 
              id="random-mode" 
              checked={randomMode} 
              onCheckedChange={setRandomMode}
            />
            <Label htmlFor="random-mode" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer">
              Random Characters
            </Label>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lessons.map((lesson) => {
          const isCompleted = completedLessons.has(lesson.id);
          
          return (
            <Card
              key={lesson.id}
              className={cn(
                "group cursor-pointer border-none transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:translate-y-[-4px]",
                isCompleted 
                  ? "bg-primary/5 shadow-inner" 
                  : "bg-surface-lowest shadow-lg shadow-black/[0.02]"
              )}
              onClick={() => setSelectedLesson(lesson)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
                    {lesson.title}
                  </CardTitle>
                  {isCompleted ? (
                    <div className="p-1.5 bg-primary/10 rounded-full shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-border group-hover:bg-primary/30 transition-colors mt-1.5" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs font-medium leading-relaxed line-clamp-2">
                  {lesson.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
