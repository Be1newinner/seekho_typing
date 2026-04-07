"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypingScreen } from "@/components/typing-screen";
import { lessons, type Lesson } from "@/lib/typing-data";
import { ArrowLeft, Check } from "lucide-react";

export function LessonsSection() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

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
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedLesson(null)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lessons
        </Button>
        
        <TypingScreen
          targetText={selectedLesson.text}
          title={selectedLesson.title}
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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Typing Lessons</h2>
        <p className="text-muted-foreground">
          Complete these 20 lessons to master touch typing
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lessons.map((lesson) => {
          const isCompleted = completedLessons.has(lesson.id);
          
          return (
            <Card
              key={lesson.id}
              className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                isCompleted ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""
              }`}
              onClick={() => setSelectedLesson(lesson)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base leading-tight">
                    {lesson.title}
                  </CardTitle>
                  {isCompleted && (
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
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
