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
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedPangram(null)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pangrams
        </Button>
        
        <TypingScreen
          targetText={selectedPangram.text}
          title={`Pangram #${selectedPangram.id}`}
          unlimitedMode={true}
          onNext={handleNextPangram}
          showNext={true}
          nextLabel="Next Pangram"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Pangram Practice</h2>
        <p className="text-muted-foreground">
          Practice with sentences that contain every letter of the alphabet
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pangrams.map((pangram) => (
          <Card
            key={pangram.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
            onClick={() => setSelectedPangram(pangram)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm">Pangram #{pangram.id}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-medium text-foreground leading-relaxed">
                &ldquo;{pangram.text}&rdquo;
              </p>
              <CardDescription className="text-xs">
                {pangram.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
