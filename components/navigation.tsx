"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Section = "lessons" | "row-practice" | "pangrams" | "exam-tests" | "games";

interface NavigationProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const sections: { id: Section; label: string }[] = [
  { id: "lessons", label: "Lessons" },
  { id: "row-practice", label: "Row Practice" },
  { id: "pangrams", label: "Pangrams" },
  { id: "exam-tests", label: "Exam Tests" },
  { id: "games", label: "Games" },
];

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeSection === section.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange(section.id)}
          className={cn(
            "text-sm font-medium",
            activeSection === section.id && "shadow-sm"
          )}
        >
          {section.label}
        </Button>
      ))}
    </nav>
  );
}
