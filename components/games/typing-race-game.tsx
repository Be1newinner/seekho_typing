"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GameMascot, MascotState } from "./game-mascot";
import { Cpu, Zap, Shield, Target } from "lucide-react";

const RACE_SENTENCES = [
  "Quantum computing leverages the principles of superposition and entanglement for processing.",
  "System integrity verified. Initializing neural network for advanced linguistic analysis.",
  "The rapid expansion of artificial intelligence is reshaping the global technological landscape.",
  "Cybersecurity protocols must be updated regularly to defend against evolving digital threats.",
  "Data encryption ensures that sensitive information remains secure during transmission over networks.",
  "Holographic interfaces provide a three-dimensional interactive experience for data visualization.",
  "Robotic automation enhances efficiency in complex manufacturing and assembly operations.",
  "Deep learning algorithms can identify intricate patterns within massive datasets automatically.",
  "Virtual reality environments offer immersive experiences for training and educational purposes.",
  "Cloud computing architecture facilitates scalable and flexible resource allocation for businesses.",
];

type Difficulty = "easy" | "medium" | "hard";

const OPPONENT_SPEEDS: Record<Difficulty, number> = {
  easy: 25,    // 25 WPM
  medium: 45,  // 45 WPM
  hard: 70,    // 70 WPM
};

export function TypingRaceGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"player" | "opponent" | null>(null);
  const [targetText, setTargetText] = useState("");
  const [input, setInput] = useState("");
  const [playerProgress, setPlayerProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const opponentRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback((selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    const randomText = RACE_SENTENCES[Math.floor(Math.random() * RACE_SENTENCES.length)];
    setTargetText(randomText);
    setInput("");
    setPlayerProgress(0);
    setOpponentProgress(0);
    setGameOver(false);
    setWinner(null);
    setStartTime(null);
    setEndTime(null);
    setCountdown(3);
    setMascotState("thinking");
  }, []);

  // Countdown effect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setGameStarted(true);
      setCountdown(null);
      setStartTime(Date.now());
      setMascotState("focused");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [countdown]);

  // Opponent movement
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const opponentSpeed = OPPONENT_SPEEDS[difficulty];
      const charsPerSecond = (opponentSpeed * 5) / 60; // Convert WPM to chars per second
      
      opponentRef.current = setInterval(() => {
        setOpponentProgress((prev) => {
          const newProgress = prev + (charsPerSecond / 10); // Update every 100ms for smoothness
          if (newProgress >= targetText.length) {
            setGameOver(true);
            setWinner((w) => {
              if (!w) setMascotState("sad");
              return w || "opponent";
            });
            setEndTime(Date.now());
            return targetText.length;
          }
          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (opponentRef.current) {
        clearInterval(opponentRef.current);
      }
    };
  }, [gameStarted, gameOver, difficulty, targetText.length]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gameStarted || gameOver) return;
    
    const value = e.target.value;
    // Basic validation: only allow typing corect chars or mistakes
    if (value.length <= targetText.length) {
      setInput(value);
      setPlayerProgress(value.length);

      // Reaction check
      if (value.length > 5 && value === targetText.substring(0, value.length)) {
        if (playerProgress > opponentProgress + 5) {
           setMascotState("happy");
        }
      }

      // Check if player finished
      if (value === targetText) {
        setGameOver(true);
        setWinner("player");
        setEndTime(Date.now());
        setMascotState("happy");
      }
    }
  };

  const playerPercent = (playerProgress / targetText.length) * 100;
  const opponentPercent = (opponentProgress / targetText.length) * 100;
  
  const timeTaken = startTime && endTime ? ((endTime - startTime) / 1000).toFixed(1) : null;
  const playerWPM = startTime && endTime 
    ? Math.round((playerProgress / 5) / ((endTime - startTime) / 60000))
    : 0;

  // Countdown screen
  if (countdown !== null) {
    return (
      <Card className="max-w-2xl mx-auto game-glass border-none overflow-hidden py-24">
         <div className="absolute inset-0 cyber-grid opacity-20" />
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={countdown}
            className="text-center relative z-10"
          >
            <p className="text-8xl font-black text-game-cyan neon-text-cyan">
              {countdown === 0 ? "GO!" : countdown}
            </p>
            <p className="text-game-cyan/60 font-bold tracking-[0.3em] uppercase mt-4">Synchronizing Neural Link...</p>
          </motion.div>
      </Card>
    );
  }

  // Game over screen
  if (gameOver) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <CardContent className="space-y-6 pt-10 relative z-10 text-center">
          <div className="flex justify-center mb-4">
             <GameMascot state={winner === "player" ? "happy" : "sad"} />
          </div>
          <h2 className={`text-4xl font-black tracking-tighter ${winner === "player" ? "text-game-green" : "text-game-red"}`}>
            {winner === "player" ? "VICTORY ACHIEVED" : "SYSTEM FAILURE"}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] uppercase font-black text-game-cyan/60 tracking-widest">Velocity</p>
              <p className="text-3xl font-black text-foreground">{playerWPM} WPM</p>
            </div>
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] uppercase font-black text-game-cyan/60 tracking-widest">Elapsed Time</p>
              <p className="text-3xl font-black text-foreground">{timeTaken}s</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={() => startGame("medium")} className="w-full bg-game-cyan text-black font-black py-6 rounded-xl hover:bg-game-cyan/80">
              RETRY MISSION
            </Button>
            <Button onClick={() => setGameStarted(false)} variant="outline" className="border-game-cyan/30 text-game-cyan hover:bg-game-cyan/10">
              LEVEL SELECT
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <CardContent className="space-y-6 pt-10 relative z-10 text-center">
          <div className="flex justify-center mb-4">
             <GameMascot state="idle" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">Neural <span className="text-game-cyan">Race</span></h2>
          <p className="text-game-cyan/70 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
            Test your throughput against a high-speed AI core. Select difficulty to begin transmission.
          </p>
          
          <div className="grid gap-3">
            <Button onClick={() => startGame("easy")} variant="outline" className="h-14 border-game-cyan/20 text-game-cyan font-bold hover:bg-game-cyan/10 flex justify-between px-6">
              <span>LEVEL 01: BEGINNER</span>
              <Shield className="h-5 w-5 opacity-50" />
            </Button>
            <Button onClick={() => startGame("medium")} variant="outline" className="h-14 border-game-purple/20 text-game-purple font-bold hover:bg-game-purple/10 flex justify-between px-6">
              <span>LEVEL 02: INTERMEDIATE</span>
              <Target className="h-5 w-5 opacity-50" />
            </Button>
            <Button onClick={() => startGame("hard")} variant="outline" className="h-14 border-game-red/20 text-game-red font-bold hover:bg-game-red/10 flex justify-between px-6">
              <span>LEVEL 03: ELITE</span>
              <Zap className="h-5 w-5 opacity-50" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active game
  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4">
      {/* Race track */}
      <div className="space-y-8 p-8 game-glass rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        
        {/* Progress tracks */}
        <div className="space-y-12 relative z-10">
          {/* Player Track */}
          <div className="relative">
             <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-black text-game-cyan tracking-widest uppercase">SYSTM_USER</span>
                <span className="font-mono text-game-cyan/60">{Math.round(playerPercent)}%</span>
             </div>
             <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-game-cyan to-transparent"
                  animate={{ width: `${playerPercent}%` }}
                />
             </div>
             {/* Player Avatar */}
             <motion.div 
                className="absolute -top-6"
                animate={{ left: `calc(${playerPercent}% - 20px)` }}
                transition={{ type: "spring", damping: 15 }}
             >
                <div className="w-10 h-10 bg-game-cyan rounded-lg flex items-center justify-center shadow-[0_0_15px_var(--game-neon-cyan)]">
                   <Cpu className="text-black h-6 w-6" />
                </div>
             </motion.div>
          </div>

          {/* Opponent Track */}
          <div className="relative">
             <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-black text-game-red tracking-widest uppercase">AI_CORE_X_{difficulty === 'hard' ? '9000' : '400'}</span>
                <span className="font-mono text-game-red/60">{Math.round(opponentPercent)}%</span>
             </div>
             <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-game-red to-transparent"
                  animate={{ width: `${opponentPercent}%` }}
                />
             </div>
             {/* Opponent Avatar */}
             <motion.div 
                className="absolute -top-6"
                animate={{ left: `calc(${opponentPercent}% - 20px)` }}
                transition={{ type: "tween", duration: 0.1 }}
             >
                <div className="w-10 h-10 bg-game-red rounded-lg flex items-center justify-center shadow-[0_0_15px_var(--game-neon-red)]">
                   <Zap className="text-black h-6 w-6" />
                </div>
             </motion.div>
          </div>
        </div>

        {/* Mascot relocated to bottom right */}
        <div className="absolute right-4 bottom-4 opacity-20 pointer-events-none scale-75">
           <GameMascot state={mascotState} />
        </div>
      </div>

      {/* Target text display */}
      <div className="p-8 game-glass rounded-3xl border-none min-h-[160px] flex items-center">
        <p className="text-2xl font-bold leading-relaxed tracking-wide">
          {targetText.split("").map((char, i) => {
            let color = "text-foreground/20";
            let bg = "";
            
            if (i < input.length) {
              if (input[i] === char) {
                color = "text-game-cyan neon-text-cyan";
              } else {
                color = "text-game-red";
                bg = "bg-game-red/20";
              }
            } else if (i === input.length) {
              color = "text-foreground animate-pulse";
              bg = "bg-foreground/10";
            }
            
            return (
              <span key={i} className={`${color} ${bg} px-[1px] rounded transition-colors duration-100`}>
                {char}
              </span>
            );
          })}
        </p>
      </div>

      {/* Input Field */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-game-cyan to-game-purple opacity-20 group-focus-within:opacity-50 blur transition-all duration-300 rounded-2xl" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="BEGIN DATA TRANSMISSION..."
          className="relative w-full p-8 text-2xl font-black text-center rounded-2xl border-none bg-game-void text-game-cyan placeholder:text-game-cyan/20 focus:outline-none tracking-widest uppercase transition-all"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {/* Progress indicator line */}
        <div className="absolute bottom-0 left-0 h-1 bg-game-cyan shadow-[0_0_10px_var(--game-neon-cyan)]" style={{ width: `${playerPercent}%` }} />
      </div>
      {/* How to Play Section */}
      <div className="game-glass rounded-2xl p-6 border-none mt-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-game-cyan/10 rounded-lg">
             <Zap className="h-4 w-4 text-game-cyan" />
          </div>
          <h3 className="text-sm font-black text-foreground dark:text-white tracking-widest uppercase italic">Mission Protocol: Neural Race</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-bold text-foreground/60 dark:text-white/40 uppercase tracking-tighter">
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">01. Sync</span>
             <span>Wait for the 3s neural synchronization countdown to reach zero.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">02. Outpace</span>
             <span>Type the target text exactly. Watch the tracks to monitor the AI core.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">03. Win</span>
             <span>Cross the finish line before the AI to secure mission success.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
