"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomWord } from "@/lib/typing-utils";
import { GameMascot, MascotState } from "./game-mascot";
import { Eye, EyeOff, Brain, ShieldAlert, Cpu } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";

const DISPLAY_TIMES: Record<Difficulty, number> = {
  easy: 3000,   
  medium: 2000, 
  hard: 1000,   
};

const WORDS_PER_LEVEL: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export function MemoryTypeGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const displayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateWords = useCallback(() => {
    const wordCount = WORDS_PER_LEVEL[difficulty];
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(getRandomWord());
    }
    return words;
  }, [difficulty]);

  const showNextWords = useCallback(() => {
    const words = generateWords();
    setCurrentWords(words);
    setIsDisplaying(true);
    setInput("");
    setMascotState("thinking");

    displayTimeoutRef.current = setTimeout(() => {
      setIsDisplaying(false);
      setMascotState("focused");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, DISPLAY_TIMES[difficulty]);
  }, [difficulty, generateWords]);

  const startGame = useCallback((selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLives(3);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setInput("");
    setMascotState("focused");
    
    setTimeout(() => {
      showNextWords();
    }, 500);
  }, [showNextWords]);

  useEffect(() => {
    return () => {
      if (displayTimeoutRef.current) {
        clearTimeout(displayTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expectedAnswer = currentWords.join(" ").toLowerCase();
    const userAnswer = input.trim().toLowerCase();

    if (userAnswer === expectedAnswer) {
      const levelBonus = level * 5;
      setScore((prev) => prev + 10 + levelBonus);
      setCorrectAnswers((prev) => prev + 1);
      setLevel((prev) => prev + 1);
      setMascotState("happy");
      showNextWords();
    } else {
      setWrongAnswers((prev) => prev + 1);
      setMascotState("sad");
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
        } else {
          showNextWords();
        }
        return Math.max(0, newLives);
      });
    }
  };

  const accuracy = correctAnswers + wrongAnswers > 0
    ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100)
    : 0;

  // Game over screen
  if (gameOver) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden text-center uppercase">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <CardContent className="space-y-6 pt-10 relative z-10">
          <div className="flex justify-center mb-4">
             <GameMascot state="sad" />
          </div>
          <h2 className="text-4xl font-black text-game-red">MEMORY BUFFER OVERFLOW</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] text-game-cyan/60 tracking-widest font-black">Score</p>
              <p className="text-3xl font-black text-foreground">{score}</p>
            </div>
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] text-game-cyan/60 tracking-widest font-black">Accuracy</p>
              <p className="text-3xl font-black text-game-green">{accuracy}%</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
             <Button onClick={() => startGame("medium")} className="w-full bg-game-cyan text-black font-black py-6 rounded-xl hover:bg-game-cyan/80">
               REBOOT CORE
             </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden uppercase">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <CardContent className="space-y-6 pt-10 relative z-10 text-center">
          <div className="flex justify-center mb-4">
             <GameMascot state="idle" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">Buffer <span className="text-game-cyan">Memory</span></h2>
          <p className="text-game-cyan/70 text-sm font-bold leading-relaxed max-w-[280px] mx-auto lowercase italic">
            Visual data packets will flash briefly. Retain and transmit the sequence into the main frame.
          </p>
          <div className="grid gap-2">
            <Button onClick={() => startGame("easy")} variant="outline" className="border-game-cyan/20 text-game-cyan h-12 uppercase font-black hover:bg-game-cyan/10">Level 0: 3s Buffer</Button>
            <Button onClick={() => startGame("medium")} variant="outline" className="border-game-purple/20 text-game-purple h-12 uppercase font-black hover:bg-game-purple/10">Level 1: 2s Buffer</Button>
            <Button onClick={() => startGame("hard")} variant="outline" className="border-game-red/20 text-game-red h-12 uppercase font-black hover:bg-game-red/10">Level 2: 1s Buffer</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active game
  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4">
       {/* HUD Header */}
       <div className="flex items-center justify-between px-8 py-5 game-glass rounded-3xl uppercase">
         <div className="flex items-center gap-10">
            <div>
               <span className="text-[10px] font-black text-game-cyan/60 tracking-widest block">Accumulated Data</span>
               <span className="font-black text-2xl text-foreground neon-text-cyan">{score}</span>
            </div>
            <div>
               <span className="text-[10px] font-black text-game-purple/60 tracking-widest block">Current Node</span>
               <span className="font-black text-2xl text-foreground">{level}</span>
            </div>
         </div>
         <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.1 }}
                className={`w-4 h-4 rounded-full ${i < lives ? "bg-game-red shadow-[0_0_10px_var(--game-neon-red)]" : "bg-foreground/10"}`}
              />
            ))}
         </div>
       </div>

      {/* Display Frame */}
      <div className="p-20 game-glass rounded-3xl border-none relative overflow-hidden text-center min-h-[280px] flex flex-col items-center justify-center">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <AnimatePresence mode="wait">
          {isDisplaying ? (
            <motion.div
              key="displaying"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="space-y-6"
            >
              <Eye className="h-10 w-10 text-game-cyan mx-auto animate-pulse" />
              <p className="text-5xl font-black text-foreground dark:text-white tracking-widest uppercase italic">
                {currentWords.join(" ")}
              </p>
              <p className="text-[10px] font-black text-game-cyan/40 tracking-[0.4em]">IMPRINTING SEQUENCE...</p>
            </motion.div>
          ) : (
            <motion.div
              key="inputting"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <EyeOff className="h-10 w-10 text-foreground/10 mx-auto" />
              <p className="text-xl text-foreground/40 font-black uppercase tracking-widest italic">
                Sequence Removed. Restore data.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mascot relocated to bottom right - subtle presence */}
        <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none scale-75">
           <GameMascot state={mascotState} />
        </div>
      </div>

      {/* Input Unit */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-game-cyan to-game-purple opacity-10 group-focus-within:opacity-40 blur transition-all duration-300 rounded-2xl" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isDisplaying ? "SYNCHRONIZING..." : "ENTER SEQUENCE HOST..."}
          disabled={isDisplaying}
          className="relative w-full p-8 text-2xl font-black text-center rounded-2xl border-none bg-game-void text-game-cyan placeholder:text-game-cyan/20 focus:outline-none tracking-widest uppercase disabled:opacity-20"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <Button 
          type="submit" 
          disabled={isDisplaying || input.trim().length === 0}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-game-cyan hover:bg-game-cyan/80 text-black font-black uppercase tracking-widest px-6"
        >
          TRANSMIT
        </Button>
      </form>
      
      <div className="flex bg-foreground/5 p-4 rounded-xl items-center gap-4 border border-foreground/5">
         <Cpu className="h-5 w-5 text-game-cyan" />
         <span className="text-[10px] font-black text-foreground/40 dark:text-white/40 tracking-widest uppercase">
            Diff Level {difficulty} | Throughput: {WORDS_PER_LEVEL[difficulty]} word/s | Decay: {DISPLAY_TIMES[difficulty] / 1000}s
         </span>
      </div>

      {/* How to Play Section */}
      <div className="game-glass rounded-2xl p-6 border-none mt-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-game-cyan/10 rounded-lg">
            <Brain className="h-4 w-4 text-game-cyan" />
          </div>
          <h3 className="text-sm font-black text-foreground dark:text-white tracking-widest uppercase italic">Mission Protocol: Buffer Memory</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-bold text-foreground/60 dark:text-white/40 uppercase tracking-tighter">
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">01. Memorize</span>
             <span>Watch the central frame for data packets. They flash briefly.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">02. Recall</span>
             <span>Once the sequence vanishes, type the exact string from memory.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">03. Extract</span>
             <span>Submit the sequence to advance through deeper neural nodes.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
