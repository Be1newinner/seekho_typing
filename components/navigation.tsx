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
  // { id: "row-practice", label: "Row Practice" },
  { id: "pangrams", label: "Pangrams" },
  { id: "exam-tests", label: "Exam Tests" },
  { id: "games", label: "Games" },
];

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="flex flex-wrap gap-1 p-1.5 bg-surface-low rounded-xl border border-border/20 shadow-sm">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={cn(
            "relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 outline-none",
            activeSection === section.id
              ? "text-primary bg-surface-lowest shadow-md shadow-primary/5 translate-y-[-1px]"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-lowest/50"
          )}
        >
          {section.label}
          {activeSection === section.id && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
          )}
        </button>
      ))}
    </nav>
  );
}
