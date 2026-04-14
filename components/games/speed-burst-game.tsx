"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomWord } from "@/lib/typing-utils";
import { GameMascot, MascotState } from "./game-mascot";
import { Zap, Trophy, Timer, Target, Activity } from "lucide-react";

const BURST_DURATION = 10; 

interface BurstResult {
  wordsTyped: number;
  accuracy: number;
  wpm: number;
}

export function SpeedBurstGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds] = useState(3);
  const [timeLeft, setTimeLeft] = useState(BURST_DURATION);
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [wordsTyped, setWordsTyped] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [results, setResults] = useState<BurstResult[]>([]);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(3);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewWord = useCallback(() => {
    setCurrentWord(getRandomWord());
    setInput("");
  }, []);

  const startRound = useCallback(() => {
    setTimeLeft(BURST_DURATION);
    setWordsTyped(0);
    setCorrectWords(0);
    setIsResting(false);
    setMascotState("focused");
    generateNewWord();
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [generateNewWord]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setCurrentRound(1);
    setResults([]);
    startRound();
  }, [startRound]);

  // Main game timer
  useEffect(() => {
    if (gameStarted && !gameOver && !isResting && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const roundAccuracy = wordsTyped > 0 
              ? Math.round((correctWords / wordsTyped) * 100) 
              : 0;
            const roundWPM = Math.round((correctWords / (BURST_DURATION / 60)));
            
            const newResult: BurstResult = {
              wordsTyped: correctWords,
              accuracy: roundAccuracy,
              wpm: roundWPM,
            };
            
            setResults((prev) => [...prev, newResult]);
            
            if (currentRound >= totalRounds) {
              setGameOver(true);
              setMascotState("happy");
            } else {
              setIsResting(true);
              setRestTime(3);
              setMascotState("thinking");
            }
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
  }, [gameStarted, gameOver, isResting, timeLeft, wordsTyped, correctWords, currentRound, totalRounds]);

  // Rest timer between rounds
  useEffect(() => {
    if (isResting && restTime > 0) {
      const timer = setTimeout(() => {
        setRestTime((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isResting && restTime === 0) {
      setCurrentRound((prev) => prev + 1);
      startRound();
    }
  }, [isResting, restTime, startRound]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const trimmedInput = input.trim().toLowerCase();
      
      setWordsTyped((prev) => prev + 1);
      
      if (trimmedInput === currentWord.toLowerCase()) {
        setCorrectWords((prev) => prev + 1);
        if (correctWords % 3 === 0) setMascotState("happy");
      } else {
        setMascotState("sad");
        setTimeout(() => setMascotState("focused"), 500);
      }
      
      generateNewWord();
    }
  };

  const totalWordsTyped = results.reduce((sum, r) => sum + r.wordsTyped, 0);
  const averageWPM = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / results.length)
    : 0;
  const bestWPM = results.length > 0 ? Math.max(...results.map(r => r.wpm)) : 0;

  // Resting between rounds
  if (isResting) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden text-center uppercase">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <CardContent className="py-20 space-y-6 relative z-10">
          <p className="text-game-cyan font-black tracking-widest">Burst {currentRound} Complete</p>
          <div className="flex justify-center">
             <GameMascot state="thinking" />
          </div>
          <p className="text-6xl font-black text-game-purple neon-text-purple animate-pulse">
            {restTime}
          </p>
          <p className="text-white/40 dark:text-white/40 text-xs font-bold tracking-[0.4em]">Cooling down processors...</p>
        </CardContent>
      </Card>
    );
  }

  // Game over screen
  if (gameOver) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden uppercase">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <CardContent className="space-y-6 pt-10 relative z-10 text-center">
          <div className="flex justify-center mb-4">
             <Trophy className="h-12 w-12 text-game-cyan animate-bounce" />
          </div>
          <h2 className="text-4xl font-black text-foreground italic uppercase">Burst <span className="text-game-cyan">Report</span></h2>
          
          <div className="space-y-2">
            {results.map((result, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
                <span className="text-xs font-black text-foreground/40 dark:text-white/40 tracking-widest">Node {i + 1}</span>
                <div className="flex gap-6 items-center">
                  <span className="text-xl font-black text-foreground dark:text-white">{result.wpm} <span className="text-[10px] text-game-cyan/40">WPM</span></span>
                  <span className="text-xs font-bold text-game-green">{result.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-game-cyan/10 rounded-xl border border-game-cyan/20">
              <p className="text-[10px] font-black text-game-cyan/60 tracking-widest">Peak Velocity</p>
              <p className="text-3xl font-black text-game-cyan">{bestWPM}</p>
            </div>
            <div className="p-4 bg-game-purple/10 rounded-xl border border-game-purple/20">
              <p className="text-[10px] font-black text-game-purple/60 tracking-widest">Avg Output</p>
              <p className="text-3xl font-black text-game-purple">{averageWPM}</p>
            </div>
          </div>

          <Button onClick={startGame} className="w-full bg-game-cyan text-black font-black py-6 rounded-xl hover:bg-game-cyan/80">
            INITIATE OVERLOAD
          </Button>
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
          <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">Overload <span className="text-game-cyan">Burst</span></h2>
          <p className="text-game-cyan/70 text-sm font-medium leading-relaxed max-w-[280px] mx-auto normal-case">
            High-intensity 10-second throughput tests. Push your neural core to the absolute limit.
          </p>
          <div className="flex items-center justify-center gap-8 py-4 opacity-50">
             <div className="text-center"><Timer className="mx-auto" /> <span className="text-[8px] font-black">10s</span></div>
             <div className="text-center"><Zap className="mx-auto" /> <span className="text-[8px] font-black">3 Rounds</span></div>
             <div className="text-center"><Activity className="mx-auto" /> <span className="text-[8px] font-black">Peak WPM</span></div>
          </div>
          <Button onClick={startGame} className="w-full bg-game-cyan text-black font-black py-6 rounded-xl">
            ENGAGE OVERDRIVE
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Active game
  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 uppercase">
      {/* Top HUD */}
      <div className="flex items-center justify-between px-8 py-5 game-glass rounded-3xl">
        <div className="flex items-center gap-10">
          <div>
            <span className="text-[10px] font-black text-foreground/40 dark:text-white/40 tracking-widest block">Neural Node</span>
            <span className="font-black text-2xl text-foreground dark:text-white">{currentRound} / {totalRounds}</span>
          </div>
          <div>
            <span className="text-[10px] font-black text-game-green/60 tracking-widest block">Restored</span>
            <span className="font-black text-2xl text-game-green">{correctWords}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className={`text-4xl font-black font-mono transition-colors ${timeLeft <= 3 ? "text-game-red animate-pulse" : "text-game-cyan"}`}>
             {timeLeft}s
           </div>
           <GameMascot state={mascotState} className="scale-75" />
        </div>
      </div>

      {/* Progress HUD */}
      <div className="h-1 bg-foreground/5 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-game-cyan shadow-[0_0_10px_var(--game-neon-cyan)]"
          animate={{ width: `${(timeLeft / BURST_DURATION) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>

      {/* Data String Frame */}
      <div className="p-16 game-glass rounded-3xl border-none relative overflow-hidden text-center min-h-[220px] flex items-center justify-center">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="absolute top-4 right-4">
           <Target className="text-game-cyan h-6 w-6 opacity-20" />
        </div>
        
        <motion.p 
          key={currentWord}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-black text-foreground dark:text-white tracking-tighter italic neon-text-cyan uppercase"
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
          placeholder="TRANSMIT AT PEAK VELOCITY..."
          className="relative w-full p-8 text-2xl font-black text-center rounded-2xl border-none bg-game-void text-game-cyan placeholder:text-game-cyan/20 focus:outline-none tracking-widest uppercase transition-all"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-4 py-1 rounded-full text-[8px] font-black text-white/40 tracking-[0.3em]">
           INPUT TERMINAL ID: NEB_004
        </div>
      </div>

      <div className="text-center">
         <p className="text-[10px] font-black text-game-cyan/20 tracking-[0.2em]">SPACE OR ENTER TO COMMIT BLOCK</p>
      </div>

      {/* How to Play Section */}
      <div className="game-glass rounded-2xl p-6 border-none mt-12 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-game-cyan/10 rounded-lg">
            <Zap className="h-4 w-4 text-game-cyan" />
          </div>
          <h3 className="text-sm font-black text-foreground dark:text-white tracking-widest uppercase italic">Mission Protocol: Overload Burst</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-bold text-foreground/60 dark:text-white/40 uppercase tracking-tighter">
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">01. Accelerate</span>
             <span>You have 10 seconds per round. Type as fast as humanly possible.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">02. Commit</span>
             <span>Hit Space or Enter after every word to clear it from the buffer.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">03. Evaluate</span>
             <span>Review your throughput across 3 rounds to see your peak velocity.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
