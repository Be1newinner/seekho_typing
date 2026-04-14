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
import { cn } from "@/lib/utils";

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
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/5 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-semibold text-xs uppercase tracking-widest">Abtort Session</span>
        </Button>

        <Card className="max-w-3xl mx-auto border-none bg-surface-lowest shadow-2xl shadow-primary/5 overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-primary to-primary-container" />
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-2">
              {selectedExam.category === "GOVT" ? (
                <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                  Official Standard
                </div>
              ) : (
                <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                  Skill Lab
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-black tracking-tight">{selectedExam.title}</CardTitle>
            <CardDescription className="text-sm font-medium leading-relaxed max-w-xl">
              {selectedExam.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 p-5 bg-surface-low rounded-2xl border border-border/10">
                <div className="p-3 bg-white shadow-sm rounded-xl">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Session Length</p>
                  <p className="font-black text-xl text-foreground">{formatTime(selectedExam.duration)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-5 bg-surface-low rounded-2xl border border-border/10">
                <div className="p-3 bg-white shadow-sm rounded-xl">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Text Volume</p>
                  <p className="font-black text-xl text-foreground">{selectedExam.text.length} <span className="text-xs font-semibold text-muted-foreground/60">Chars</span></p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-200/50 dark:bg-amber-900/50 rounded-lg shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-amber-900 dark:text-amber-200">
                    Protocols & Guidelines
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6 text-[11px] font-semibold text-amber-800/80 dark:text-amber-300/80 list-disc pl-4 leading-relaxed">
                    <li>Real-time termination on timeout</li>
                    <li>Strict accuracy weighted scoring</li>
                    <li>Official evaluation algorithm</li>
                    <li>Indian Government Exam Standards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-white dark:bg-black/20 rounded-2xl border border-border/10 shadow-sm">
              <div className="space-y-1">
                <Label htmlFor="exam-no-backspace" className="text-sm font-black tracking-tight">
                  Stricter Correction
                </Label>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Disable the backspace key for this session
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
              className="w-full text-lg h-16 rounded-2xl font-black tracking-wide shadow-2xl shadow-primary/20 hover:scale-[1.01] transition-transform active:scale-95"
              onClick={handleBeginTyping}
            >
              Initiate Examination
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
      <div className="space-y-6 animate-in zoom-in-95 duration-500">
        <div className="flex justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-2 rounded-full border-destructive/20 text-destructive hover:bg-destructive/5 font-bold uppercase tracking-widest text-[10px]"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Terminate Session
          </Button>
        </div>
        
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
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/10">
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tighter text-foreground">Examination Terminal</h2>
          <p className="text-muted-foreground max-w-xl leading-relaxed font-medium">
            Simulate the intensity of Indian Government typing exams with our <span className="text-emerald-600 font-bold">Official Standard</span> environments.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex p-1.5 bg-surface-low rounded-2xl border border-border/10">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={cn(
              "px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
              categoryFilter === "ALL" ? "bg-white text-primary shadow-lg shadow-black/5" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All <span className="ml-1 opacity-50 font-normal">{examTests.length}</span>
          </button>
          <button
            onClick={() => setCategoryFilter("GOVT")}
            className={cn(
              "px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
              categoryFilter === "GOVT" ? "bg-white text-emerald-600 shadow-lg shadow-black/5" : "text-muted-foreground hover:text-foreground"
            )}
          >
            GOVT <span className="ml-1 opacity-50 font-normal">{govtExamsCount}</span>
          </button>
          <button
            onClick={() => setCategoryFilter("OTHER")}
            className={cn(
              "px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
              categoryFilter === "OTHER" ? "bg-white text-blue-600 shadow-lg shadow-black/5" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Other <span className="ml-1 opacity-50 font-normal">{otherExamsCount}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExams.map((exam) => (
          <Card
            key={exam.id}
            className="group cursor-pointer border-none bg-surface-lowest shadow-xl shadow-black/[0.02] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:translate-y-[-8px] overflow-hidden flex flex-col"
            onClick={() => handleStartExam(exam)}
          >
            <div className={cn(
              "h-1.5 w-full transition-colors",
              exam.category === "GOVT" ? "bg-emerald-500/20 group-hover:bg-emerald-500" : "bg-primary/20 group-hover:bg-primary"
            )} />
            
            <CardHeader className="p-6 pb-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-surface-low rounded-lg group-hover:scale-110 transition-transform">
                  <Clock className={cn("h-4 w-4", exam.category === "GOVT" ? "text-emerald-600" : "text-primary")} />
                </div>
                {exam.category === "GOVT" && (
                  <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full">
                    Official
                  </span>
                )}
              </div>
              <CardTitle className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{exam.title}</CardTitle>
            </CardHeader>

            <CardContent className="p-6 pt-2 flex-grow flex flex-col justify-between space-y-6">
              <CardDescription className="text-xs font-medium leading-relaxed line-clamp-2 italic">
                "{exam.description}"
              </CardDescription>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-black tracking-tight">{formatTime(exam.duration)}</span>
                </div>
                {exam.noBackspaceDefault && (
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-md">
                    No Backspace
                  </div>
                )}
              </div>
              
              <Button className={cn(
                "w-full rounded-2xl font-black tracking-widest text-[10px] uppercase h-12 shadow-lg shadow-black/5 group-hover:shadow-primary/20 group-hover:translate-y-[-2px] transition-all",
                exam.category === "GOVT" ? "hover:bg-emerald-600" : ""
              )}>
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
