"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypingScreen } from "@/components/typing-screen";
import { rowPractices, type RowPractice } from "@/lib/typing-data";
import { ArrowLeft, Keyboard } from "lucide-react";

export function RowPracticeSection() {
  const [selectedRow, setSelectedRow] = useState<RowPractice | null>(null);

  if (selectedRow) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedRow(null)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Row Practice
        </Button>
        
        <TypingScreen
          targetText={selectedRow.practiceText}
          title={selectedRow.name + " Practice"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Row Practice</h2>
        <p className="text-muted-foreground">
          Practice specific keyboard rows to build muscle memory
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rowPractices.map((row) => (
          <Card
            key={row.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
            onClick={() => setSelectedRow(row)}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{row.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>{row.description}</CardDescription>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="font-mono text-lg font-bold tracking-widest text-foreground">
                  {row.keys}
                </p>
              </div>
              <Button className="w-full">Start Practice</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
