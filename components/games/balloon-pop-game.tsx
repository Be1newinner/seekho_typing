"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomWord } from "@/lib/typing-utils";
import { GameMascot, MascotState } from "./game-mascot";

interface Balloon {
  id: number;
  word: string;
  x: number;
  y: number;
  color: string;
  isPopping?: boolean;
}

const BALLOON_COLORS = [
  "from-cyan-400 to-cyan-600",
  "from-purple-400 to-purple-600",
  "from-pink-400 to-pink-600",
  "from-green-400 to-green-600",
  "from-orange-400 to-orange-600",
  "from-blue-400 to-blue-600",
];

export function BalloonPopGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [input, setInput] = useState("");
  const [balloonsPopped, setBalloonsPopped] = useState(0);
  const [balloonsMissed, setBalloonsMissed] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);
  const balloonIdRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const spawnBalloon = useCallback(() => {
    const newBalloon: Balloon = {
      id: balloonIdRef.current++,
      word: getRandomWord(),
      x: Math.random() * 70 + 15, // 15-85% horizontal position
      y: 110, // Start below bottom
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
    };
    setBalloons((prev) => [...prev, newBalloon]);
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    // Spawn new balloons
    const spawnRate = Math.max(800, 1800 - Math.floor(score / 100) * 100);
    if (timestamp - lastSpawnRef.current > spawnRate) {
      spawnBalloon();
      lastSpawnRef.current = timestamp;
    }

    // Update balloon positions (floating up)
    setBalloons((prev) => {
      const updated = prev.map((balloon) => ({
        ...balloon,
        y: balloon.isPopping ? balloon.y : balloon.y - 0.25 - (score / 1000), // Speed up with score
      }));

      // Check for balloons that escaped at the top
      const remaining: Balloon[] = [];
      let livesLost = 0;
      let missed = 0;

      for (const balloon of updated) {
        if (balloon.y <= -10 && !balloon.isPopping) {
          livesLost++;
          missed++;
        } else {
          remaining.push(balloon);
        }
      }

      if (livesLost > 0) {
        setLives((prev) => {
          const newLives = prev - livesLost;
          if (newLives <= 0) {
            setGameOver(true);
            setMascotState("sad");
          }
          return Math.max(0, newLives);
        });
        setBalloonsMissed((prev) => prev + missed);
        setCombo(0);
        setMascotState("thinking");
      }

      return remaining;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [spawnBalloon, score]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
      inputRef.current?.focus();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, gameLoop]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInput(value);

    // Check if typed word matches any balloon
    const matchIndex = balloons.findIndex((b) => b.word.toLowerCase() === value && !b.isPopping);
    if (matchIndex !== -1) {
      const targetBalloon = balloons[matchIndex];
      
      // Visual pop effect
      setBalloons((prev) => 
        prev.map(b => b.id === targetBalloon.id ? { ...b, isPopping: true } : b)
      );

      // Delayed removal
      setTimeout(() => {
        setBalloons((prev) => prev.filter((b) => b.id !== targetBalloon.id));
      }, 300);

      const newCombo = combo + 1;
      const comboBonus = Math.floor(newCombo / 5) * 10;
      setScore((prev) => prev + 10 + comboBonus);
      setBalloonsPopped((prev) => prev + 1);
      setCombo(newCombo);
      
      if (newCombo > bestCombo) {
        setBestCombo(newCombo);
      }

      if (newCombo % 5 === 0) {
        setMascotState("happy");
        setTimeout(() => setMascotState("focused"), 1000);
      } else {
        setMascotState("focused");
      }

      setInput("");
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(5);
    setBalloons([]);
    setInput("");
    setBalloonsPopped(0);
    setBalloonsMissed(0);
    setCombo(0);
    setBestCombo(0);
    setMascotState("focused");
    balloonIdRef.current = 0;
    lastSpawnRef.current = performance.now();
  };

  const accuracy = balloonsPopped + balloonsMissed > 0 
    ? Math.round((balloonsPopped / (balloonsPopped + balloonsMissed)) * 100) 
    : 0;

  // Game over screen
  if (gameOver) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
        <CardContent className="space-y-6 pt-10 relative z-10">
          <div className="flex justify-center mb-4">
             <GameMascot state="sad" />
          </div>
          <h2 className="text-center text-4xl font-extrabold neon-text-cyan tracking-tighter">GAME OVER</h2>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] uppercase font-black text-game-cyan/60 tracking-widest">Final Score</p>
              <p className="text-3xl font-black text-foreground">{score}</p>
            </div>
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] uppercase font-black text-game-cyan/60 tracking-widest">Accuracy</p>
              <p className="text-3xl font-black text-game-green">{accuracy}%</p>
            </div>
          </div>

          <Button 
            onClick={startGame} 
            className="w-full bg-game-cyan hover:bg-game-cyan/80 text-black font-black py-6 rounded-xl animate-pulse-glow"
          >
            REBOOT SYSTEM
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
        <CardContent className="space-y-6 pt-10 relative z-10 text-center">
          <div className="flex justify-center mb-4">
             <GameMascot state="idle" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">Balloon <span className="text-game-cyan">Pop</span></h2>
          <p className="text-game-cyan/70 text-sm leading-relaxed max-w-[280px] mx-auto font-bold lowercase italic">
            Type the words to neutralize rising data balloons. Build combos for power-ups. Maintain system integrity.
          </p>
          <Button 
            onClick={startGame} 
            className="w-full bg-game-cyan hover:bg-game-cyan/80 text-black font-black py-6 rounded-xl"
          >
            INITIALIZE GAME
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Active game
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Stats bar */}
      <div className="flex items-center justify-between px-6 py-4 game-glass rounded-2xl">
        <div className="flex items-center gap-8">
          <div>
            <span className="text-[10px] uppercase font-black text-game-cyan/60 tracking-widest block mb-1">Total Score</span>
            <span className="font-black text-2xl text-foreground neon-text-cyan">{score}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-game-purple/60 tracking-widest block mb-1">Combo</span>
            <span className="font-black text-2xl text-game-purple">{combo}x</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1 }}
              animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.2 }}
              className={`w-4 h-4 rounded-full ${i < lives ? "bg-game-red shadow-[0_0_10px_var(--game-neon-red)]" : "bg-white/10 dark:bg-white/10"}`}
            />
          ))}
        </div>
      </div>

      {/* Game area */}
      <div
        className="relative w-full h-[500px] bg-game-void border border-game-cyan/20 rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        {/* Mascot overlay - relocated to bottom right */}
        <div className="absolute bottom-4 right-4 z-20 opacity-30 pointer-events-none scale-75">
           <GameMascot state={mascotState} />
        </div>

        <AnimatePresence>
          {balloons.map((balloon) => (
            <motion.div
              key={balloon.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: balloon.isPopping ? 0 : 1, 
                scale: balloon.isPopping ? 1.5 : 1,
                rotate: balloon.isPopping ? [0, 10, -10, 0] : 0
              }}
              exit={{ opacity: 0, scale: 2 }}
              className="absolute pointer-events-none"
              style={{
                left: `${balloon.x}%`,
                bottom: `${balloon.y}%`,
                transform: "translateX(-50%)",
              }}
            >
              {/* Balloon */}
              <div className={`relative bg-gradient-to-br ${balloon.color} rounded-full w-24 h-28 flex items-center justify-center shadow-2xl border border-white/20 group`}>
                <span className="text-white font-black text-sm px-2 text-center break-all filter drop-shadow-md">
                  {balloon.word}
                </span>
                {/* Visual highlight */}
                <div className="absolute top-4 left-4 w-6 h-8 bg-white/20 rounded-full rotate-12 blur-[1px]" />
                
                {/* Balloon knot */}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-current opacity-40 rotate-45`} />
              </div>
              {/* String */}
              <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent mx-auto" />
              
              {/* Popping particle effect (simulated) */}
              {balloon.isPopping && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        animate={{ x: (i - 2.5) * 40, y: (Math.random() - 0.5) * 40, opacity: 0 }}
                        className="w-2 h-2 rounded-full bg-white absolute"
                      />
                    ))}
                 </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-game-cyan to-game-purple opacity-20 group-focus-within:opacity-50 blur transition-all duration-300 rounded-2xl" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="TYPE COMMAND TO NEUTRALIZE..."
          className="relative w-full p-6 text-2xl font-black text-center rounded-2xl border-none bg-game-void text-game-cyan placeholder:text-game-cyan/20 focus:outline-none tracking-widest uppercase transition-all"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {/* Caret glow */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-game-cyan shadow-[0_0_20px_var(--game-neon-cyan)] rounded-full" />
      </div>
      {/* How to Play Section */}
      <div className="game-glass rounded-2xl p-6 border-none mt-12 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-game-cyan/10 rounded-lg">
             <Target className="h-4 w-4 text-game-cyan" />
          </div>
          <h3 className="text-sm font-black text-foreground dark:text-white tracking-widest uppercase italic">Mission Protocol: Balloon Pop</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-bold text-foreground/60 dark:text-white/40 uppercase tracking-tighter text-left">
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">01. Target</span>
             <span>Observe the data balloons floating up. Each carries a unique word packet.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">02. Neutralize</span>
             <span>Type the word on a balloon to pop it and secure the data. No Enter key required!</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">03. Combo</span>
             <span>Popping balloons in rapid succession builds combos and multiplies your score.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const Target = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
