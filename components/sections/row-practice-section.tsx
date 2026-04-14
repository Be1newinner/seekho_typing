"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypingScreen } from "@/components/typing-screen";
import { rowPractices, type RowPractice } from "@/lib/typing-data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Keyboard, ExternalLink } from "lucide-react";

export function RowPracticeSection() {
  const [selectedRow, setSelectedRow] = useState<RowPractice | null>(null);
  const [randomMode, setRandomMode] = useState(false);

  const generateRandomText = (keys: string) => {
    const chars = keys.split("");
    let result = "";
    for (let i = 0; i < 30; i++) {
        let word = "";
        const wordLen = 4 + Math.floor(Math.random() * 2);
        for (let j = 0; j < wordLen; j++) {
            word += chars[Math.floor(Math.random() * chars.length)];
        }
        result += word + " ";
    }
    return result.trim().toLowerCase();
  };

  const practiceText = selectedRow 
    ? (randomMode ? generateRandomText(selectedRow.keys) : selectedRow.practiceText)
    : "";

  if (selectedRow) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedRow(null)}
          className="gap-2 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/5 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-semibold text-xs uppercase tracking-widest">Back to Gallery</span>
        </Button>
        
        <TypingScreen
          targetText={practiceText}
          title={selectedRow.name + " Practice" + (randomMode ? " (Randomized)" : "")}
          unlimitedMode={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 text-left">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Row Mastery</h2>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Isolate and conquer. Practice specific keyboard rows to build the muscle memory required for <span className="text-primary font-bold">extreme precision</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-surface-low rounded-2xl border border-border/10">
          <div className="flex items-center gap-2">
            <Switch 
              id="row-random-mode" 
              checked={randomMode} 
              onCheckedChange={setRandomMode}
            />
            <Label htmlFor="row-random-mode" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer">
              Random Characters
            </Label>
          </div>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rowPractices.map((row) => (
          <Card
            key={row.id}
            className="group cursor-pointer border-none bg-surface-lowest shadow-xl shadow-black/[0.02] transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:translate-y-[-6px] overflow-hidden"
            onClick={() => setSelectedRow(row)}
          >
            <div className="h-1.5 w-full bg-primary/10 group-hover:bg-primary transition-colors" />
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Keyboard className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-black tracking-tight">{row.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <CardDescription className="text-xs font-medium leading-relaxed">
                {row.description}
              </CardDescription>
              
              <div className="relative py-6 px-4 bg-surface-low rounded-xl border border-border/10 group-hover:bg-white group-hover:border-primary/20 transition-all text-center">
                <p className="font-mono text-2xl font-black tracking-[0.3em] text-primary/80 group-hover:text-primary">
                  {row.keys}
                </p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-3 w-3 text-primary/40" />
                </div>
              </div>

              <Button className="w-full rounded-full font-bold shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all">
                Drill This Row
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
