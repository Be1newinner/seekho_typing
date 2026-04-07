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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6 justify-center">
          {/* Main Content */}
          <div className="max-w-5xl flex-1 min-w-0 space-y-6">
            <Navigation 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />
            
            <div className="min-h-[600px]">
              {renderSection()}
            </div>
          </div>
          
          {/* Promotional Sidebar - Hidden on smaller screens */}
          <PromoSidebar />
        </div>
      </main>
      
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Practice regularly to improve your typing speed and accuracy.</p>
      </footer>
    </div>
  );
}
