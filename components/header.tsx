"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <a
          href="/"
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="font-bold text-lg">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground bg-clip-text">
              Seekho <span className="text-primary">Typing</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              Computer Institute
            </span>
          </div>
        </a>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 mr-4">
            <a href="https://seekhocomputer.com" target="_blank" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Courses</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</a>
          </nav>

          {mounted && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-surface-lowest/50 border-border/40 hover:bg-surface-lowest shadow-sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
