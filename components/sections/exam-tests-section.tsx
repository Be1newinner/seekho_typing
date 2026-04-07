"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TypingScreen } from "@/components/typing-screen";
import { examTests, type ExamTest, type ExamCategory } from "@/lib/typing-data";
import { ArrowLeft, Clock, FileText, AlertTriangle, Building2, BookOpen } from "lucide-react";
import { formatTime } from "@/lib/typing-utils";

export function ExamTestsSection() {
  const [selectedExam, setSelectedExam] = useState<ExamTest | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [noBackspaceOverride, setNoBackspaceOverride] = useState<boolean | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<ExamCategory | "ALL">("ALL");

  const filteredExams = useMemo(() => {
    if (categoryFilter === "ALL") return examTests;
    return examTests.filter((exam) => exam.category === categoryFilter);
  }, [categoryFilter]);

  const govtExamsCount = examTests.filter((e) => e.category === "GOVT").length;
  const otherExamsCount = examTests.filter((e) => e.category === "OTHER").length;

  const handleStartExam = (exam: ExamTest) => {
    setSelectedExam(exam);
    setNoBackspaceOverride(null);
  };

  const handleBeginTyping = () => {
    setExamStarted(true);
  };

  const handleBack = () => {
    setSelectedExam(null);
    setExamStarted(false);
    setNoBackspaceOverride(null);
  };

  // Exam configuration screen
  if (selectedExam && !examStarted) {
    const useNoBackspace = noBackspaceOverride ?? selectedExam.noBackspaceDefault;

    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exam Tests
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              {selectedExam.category === "GOVT" && (
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                  GOVT
                </span>
              )}
              <CardTitle className="text-xl">{selectedExam.title}</CardTitle>
            </div>
            <CardDescription>{selectedExam.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Limit</p>
                  <p className="font-bold text-lg">{formatTime(selectedExam.duration)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Characters</p>
                  <p className="font-bold text-lg">{selectedExam.text.length}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Exam Rules
                  </p>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>The test will automatically end when time runs out</li>
                    <li>Your final results will be calculated based on accuracy and speed</li>
                    {selectedExam.category === "GOVT" && (
                      <li>This simulates real Indian government typing exam conditions</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="exam-no-backspace" className="text-sm font-medium">
                  Disable Backspace/Delete
                </Label>
                <p className="text-xs text-muted-foreground">
                  Simulates stricter exam conditions
                </p>
              </div>
              <Switch
                id="exam-no-backspace"
                checked={useNoBackspace}
                onCheckedChange={(checked) => setNoBackspaceOverride(checked)}
              />
            </div>

            <Button 
              size="lg" 
              className="w-full text-lg py-6"
              onClick={handleBeginTyping}
            >
              Start Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active exam
  if (selectedExam && examStarted) {
    const useNoBackspace = noBackspaceOverride ?? selectedExam.noBackspaceDefault;

    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit Exam
        </Button>
        
        <TypingScreen
          targetText={selectedExam.text}
          title={selectedExam.title}
          timeLimit={selectedExam.duration}
          defaultNoBackspace={useNoBackspace}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Exam Tests</h2>
        <p className="text-muted-foreground">
          Practice with timed tests similar to Indian government typing exams
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={categoryFilter === "ALL" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("ALL")}
          className="gap-2"
        >
          All Tests
          <span className="px-1.5 py-0.5 text-xs rounded-full bg-background/20">
            {examTests.length}
          </span>
        </Button>
        <Button
          variant={categoryFilter === "GOVT" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("GOVT")}
          className="gap-2"
        >
          <Building2 className="h-4 w-4" />
          GOVT Exams
          <span className="px-1.5 py-0.5 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
            {govtExamsCount}
          </span>
        </Button>
        <Button
          variant={categoryFilter === "OTHER" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("OTHER")}
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" />
          OTHER Practice
          <span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
            {otherExamsCount}
          </span>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExams.map((exam) => (
          <Card
            key={exam.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
            onClick={() => handleStartExam(exam)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{exam.title}</CardTitle>
                </div>
                {exam.category === "GOVT" && (
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full shrink-0">
                    GOVT
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="line-clamp-2">{exam.description}</CardDescription>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatTime(exam.duration)}</span>
                </div>
                {exam.noBackspaceDefault && (
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                    No Backspace
                  </span>
                )}
              </div>
              
              <Button className="w-full">Start Test</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
