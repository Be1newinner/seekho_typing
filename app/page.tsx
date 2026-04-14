"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Navigation, type Section } from "@/components/navigation";
import { LessonsSection } from "@/components/sections/lessons-section";
import { RowPracticeSection } from "@/components/sections/row-practice-section";
import { PangramsSection } from "@/components/sections/pangrams-section";
import { ExamTestsSection } from "@/components/sections/exam-tests-section";
import { GamesSection } from "@/components/sections/games-section";
import { PromoSidebar } from "@/components/promo-sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("lessons");

  const renderSection = () => {
    switch (activeSection) {
      case "lessons":
        return <LessonsSection />;
      case "row-practice":
        return <RowPracticeSection />;
      case "pangrams":
        return <PangramsSection />;
      case "exam-tests":
        return <ExamTestsSection />;
      case "games":
        return <GamesSection />;
      default:
        return <LessonsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-low selection:bg-primary/10 selection:text-primary transition-colors duration-500">
      <Header />

      <main className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10 justify-center items-start">
          {/* Main Content */}
          <div className="w-full lg:max-w-4xl xl:max-w-5xl space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/10">
              <div className="space-y-1">
                <h1 className="text-sm font-black uppercase tracking-[0.3em] text-primary/60">Practice Dashboard</h1>
                <p className="text-xs font-semibold text-muted-foreground">Select your training modules to begin mastery</p>
              </div>
              <Navigation
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {renderSection()}
            </div>
          </div>

          {/* Promotional Sidebar */}
          <PromoSidebar />
        </div>
      </main>

      <footer className="border-t border-border/10 py-12 bg-surface-low/50">
        <div className="container mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white text-[10px] font-bold">S</div>
            <span className="text-sm font-bold tracking-tighter">
              <Link href="https://shipsar.in/">Seekho Computer</Link></span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/40 text-center">
            Precision • Speed • Mastery
          </p>
          <p className="text-[11px] font-medium text-muted-foreground/60 max-w-xs text-center leading-relaxed">
            Built with love by <Link href="https://www.shipsar.in/">Shipsar Developers</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
