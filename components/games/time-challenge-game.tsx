"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomWord, formatTime } from "@/lib/typing-utils";
import { GameMascot, MascotState } from "./game-mascot";
import { Activity, Clock, ShieldAlert, Terminal } from "lucide-react";

type Duration = 30 | 60;

export function TimeChallengeGame() {
  const [duration, setDuration] = useState<Duration>(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewWord = useCallback(() => {
    setCurrentWord(getRandomWord());
    setInput("");
  }, []);

  const startGame = useCallback((selectedDuration: Duration) => {
    setDuration(selectedDuration);
    setTimeLeft(selectedDuration);
    setGameStarted(true);
    setGameOver(false);
    setCorrectWords(0);
    setIncorrectWords(0);
    setTotalCharacters(0);
    setMascotState("focused");
    generateNewWord();
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [generateNewWord]);

  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            setMascotState("happy");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameOver, timeLeft]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const trimmedInput = input.trim().toLowerCase();
      
      if (trimmedInput === currentWord.toLowerCase()) {
        setCorrectWords((prev) => prev + 1);
        setTotalCharacters((prev) => prev + currentWord.length);
        if (correctWords % 5 === 0) setMascotState("happy");
      } else if (trimmedInput.length > 0) {
        setIncorrectWords((prev) => prev + 1);
        setMascotState("sad");
        setTimeout(() => setMascotState("focused"), 500);
      }
      
      generateNewWord();
    }
  };

  const accuracy = correctWords + incorrectWords > 0
    ? Math.round((correctWords / (correctWords + incorrectWords)) * 100)
    : 0;

  const wpm = duration > 0 ? Math.round((correctWords / (duration / 60))) : 0;

  // Game over screen
  if (gameOver) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden uppercase text-center">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <CardContent className="space-y-6 pt-10 relative z-10">
          <div className="flex justify-center mb-4">
             <GameMascot state="happy" />
          </div>
          <h2 className="text-4xl font-black text-game-cyan">STRESS TEST COMPLETE</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] text-game-cyan/60 tracking-widest font-black">Net Velocity</p>
              <p className="text-3xl font-black text-foreground dark:text-white">{wpm} WPM</p>
            </div>
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] text-game-cyan/60 tracking-widest font-black">Accuracy</p>
              <p className="text-3xl font-black text-game-green">{accuracy}%</p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <Button onClick={() => startGame(30)} className="flex-1 bg-game-cyan text-black font-black py-6 rounded-xl">30S RE-TEST</Button>
             <Button onClick={() => startGame(60)} className="flex-1 bg-game-purple text-black font-black py-6 rounded-xl">60S RE-TEST</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden uppercase text-center">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <CardContent className="space-y-6 pt-10 relative z-10">
          <div className="flex justify-center mb-4">
             <GameMascot state="idle" />
          </div>
          <h2 className="text-3xl font-black text-foreground dark:text-white italic tracking-tight uppercase">System <span className="text-game-cyan">Stress</span></h2>
          <p className="text-game-cyan/70 text-sm font-bold leading-relaxed max-w-[280px] mx-auto lowercase italic">
            Extended sustained throughput test. Maintain high precision under constant time pressure.
          </p>
          <div className="flex gap-3 pt-4">
            <Button onClick={() => startGame(30)} className="flex-1 bg-game-cyan/10 border border-game-cyan/30 text-game-cyan font-black py-6 rounded-xl hover:bg-game-cyan/20 transition-all">30 SECONDS</Button>
            <Button onClick={() => startGame(60)} className="flex-1 bg-game-purple/10 border border-game-purple/30 text-game-purple font-black py-6 rounded-xl hover:bg-game-purple/20 transition-all">60 SECONDS</Button>
          </div>
          <p className="text-[10px] text-white/20 font-bold tracking-widest pt-2">AUTHORIZED ACCESS ONLY</p>
        </CardContent>
      </Card>
    );
  }

  // Active game
  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 uppercase">
       {/* HUD Header */}
       <div className="flex items-center justify-between px-8 py-5 game-glass rounded-3xl">
          <div className="flex gap-10">
             <div>
                <span className="text-[10px] font-black text-game-green/60 tracking-widest block">Valid</span>
                <span className="font-black text-2xl text-foreground dark:text-white">{correctWords}</span>
             </div>
             <div>
                <span className="text-[10px] font-black text-game-red/60 tracking-widest block">Invalid</span>
                <span className="font-black text-2xl text-foreground dark:text-white">{incorrectWords}</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className={`text-4xl font-black font-mono transition-colors ${timeLeft < 10 ? "text-game-red animate-pulse" : "text-game-cyan"}`}>
                {formatTime(timeLeft)}
             </div>
             <GameMascot state={mascotState} className="scale-75" />
          </div>
       </div>

      {/* Frame */}
      <div className="p-16 game-glass rounded-3xl border-none relative overflow-hidden text-center min-h-[220px] flex items-center justify-center">
         <div className="absolute inset-0 cyber-grid opacity-10" />
         <div className="absolute top-4 left-4">
            <Activity className="text-game-cyan h-6 w-6 opacity-30 animate-pulse" />
         </div>
          <motion.p 
            key={currentWord}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-black text-foreground dark:text-white italic tracking-tighter neon-text-cyan uppercase"
          >
            {currentWord}
          </motion.p>
      </div>

      {/* Input Module */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-game-cyan to-game-purple opacity-20 group-focus-within:opacity-50 blur transition-all duration-300 rounded-2xl" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="TRANSMITTING..."
          className="relative w-full p-8 text-2xl font-black text-center rounded-2xl border-none bg-game-void text-game-cyan placeholder:text-game-cyan/20 focus:outline-none tracking-widest uppercase"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <div className="absolute -top-3 right-6 bg-game-void border border-white/10 px-4 py-1 rounded-full text-[8px] font-black text-white/40 tracking-widest">
           MODULE: STRESS_TEST_A
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-6 text-[10px] font-black text-white/20 tracking-[0.2em]">
         <div className="flex items-center gap-2"><Clock className="h-3 w-3" /> SUSTAINED_SESSION</div>
         <div className="flex items-center gap-2"><Terminal className="h-3 w-3" /> {accuracy}%_INTEGRITY</div>
      </div>

      {/* How to Play Section */}
      <div className="game-glass rounded-2xl p-6 border-none mt-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-game-cyan/10 rounded-lg">
            <Activity className="h-4 w-4 text-game-cyan" />
          </div>
          <h3 className="text-sm font-black text-foreground dark:text-white tracking-widest uppercase italic">Mission Protocol: System Stress</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-bold text-foreground/60 dark:text-white/40 uppercase tracking-tighter">
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">01. Sustain</span>
             <span>Maintain high-speed typing for the entire session duration.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">02. Precision</span>
             <span>Only 100% correct words contribute to your final throughput rating.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">03. Spacebar</span>
             <span>Use the Spacebar or Enter to submit each completed word block.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
