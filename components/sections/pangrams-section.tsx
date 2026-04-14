"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypingScreen } from "@/components/typing-screen";
import { pangrams, type Pangram } from "@/lib/typing-data";
import { ArrowLeft, Type } from "lucide-react";

export function PangramsSection() {
  const [selectedPangram, setSelectedPangram] = useState<Pangram | null>(null);

  const handleNextPangram = () => {
    if (selectedPangram) {
      const currentIndex = pangrams.findIndex((p) => p.id === selectedPangram.id);
      const nextPangram = pangrams[currentIndex + 1];
      if (nextPangram) {
        setSelectedPangram(nextPangram);
      } else {
        setSelectedPangram(pangrams[0]); // Loop back to first
      }
    }
  };

  if (selectedPangram) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedPangram(null)}
          className="gap-2 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/5 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-semibold text-xs uppercase tracking-widest">Back to Gallery</span>
        </Button>
        
        <TypingScreen
          targetText={selectedPangram.text}
          title={`Pangram Master #${selectedPangram.id}`}
          unlimitedMode={true}
          onNext={handleNextPangram}
          showNext={true}
          nextLabel="Next Pangram"
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-3">
        <h2 className="text-3xl font-black tracking-tight text-foreground">Pangram Flow</h2>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          The ultimate alphabet drill. Master sentences that weave <span className="text-primary font-bold">every letter</span> into a single, elegant flow.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pangrams.map((pangram) => (
          <Card
            key={pangram.id}
            className="group cursor-pointer border-none bg-surface-lowest shadow-lg shadow-black/[0.02] transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:translate-y-[-4px] flex flex-col"
            onClick={() => setSelectedPangram(pangram)}
          >
            <CardHeader className="pb-3 border-b border-border/5 group-hover:bg-primary/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Type className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                    Drill #{pangram.id}
                  </CardTitle>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-6 flex-grow flex flex-col justify-between space-y-4">
              <p className="text-base font-semibold text-foreground leading-relaxed italic font-serif">
                &ldquo;{pangram.text}&rdquo;
              </p>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 group-hover:text-muted-foreground transition-colors px-2 py-1 bg-surface-low rounded group-hover:bg-primary/5">
                {pangram.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
