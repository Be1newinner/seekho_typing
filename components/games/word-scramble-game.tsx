"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomWord, formatTime } from "@/lib/typing-utils";
import { GameMascot, MascotState } from "./game-mascot";
import { Brain, Lightbulb, SkipForward, Terminal } from "lucide-react";

const GAME_DURATION = 60;

function scrambleWord(word: string): string {
  if (word.length <= 1) return word;
  
  const arr = word.split("");
  let attempts = 0;
  let scrambled = "";
  
  // Try scrambling up to 10 times to get a different word
  while (attempts < 10) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    scrambled = arr.join("");
    if (scrambled !== word) break;
    attempts++;
  }
  
  return scrambled;
}

export function WordScrambleGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [wordsUnscrambled, setWordsUnscrambled] = useState(0);
  const [hints, setHints] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [roundId, setRoundId] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const generateNewWord = useCallback(() => {
    const word = getRandomWord();
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setInput("");
    setShowHint(false);
    setRoundId(prev => prev + 1);
    setMascotState("thinking");
    setTimeout(() => setMascotState("focused"), 500);
  }, []);

  const startGame = useCallback(() => {
    setTimeLeft(GAME_DURATION);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setWordsUnscrambled(0);
    setHints(3);
    setMascotState("focused");
    generateNewWord();
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [generateNewWord]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            setMascotState("sad");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedInput = input.trim().toLowerCase();
      
      if (trimmedInput === currentWord.toLowerCase()) {
        const points = 10 + (streak * 5); 
        setScore((prev) => prev + points);
        setWordsUnscrambled((prev) => prev + 1);
        setStreak((prev) => {
          const newStreak = prev + 1;
          if (newStreak > bestStreak) setBestStreak(newStreak);
          return newStreak;
        });
        setMascotState("happy");
        generateNewWord();
      } else if (trimmedInput.length > 0) {
        setStreak(0);
        setInput("");
        setMascotState("sad");
        setTimeout(() => setMascotState("focused"), 1000);
      }
    }
  };

  const useHint = () => {
    if (hints > 0 && !showHint) {
      setHints((prev) => prev - 1);
      setShowHint(true);
      setMascotState("happy");
      setTimeout(() => setMascotState("focused"), 1000);
    }
  };

  const skipWord = () => {
    setStreak(0);
    generateNewWord();
    setMascotState("thinking");
  };

  // Game over screen
  if (gameOver) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden text-center uppercase">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <CardContent className="space-y-6 pt-10 relative z-10">
          <div className="flex justify-center mb-4">
             <GameMascot state="sad" />
          </div>
          <h2 className="text-4xl font-black text-game-red">SESSION TIMEOUT</h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
                <p className="text-[10px] text-game-cyan/60 tracking-widest font-black">Score</p>
                <p className="text-3xl font-black text-foreground">{score}</p>
             </div>
             <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
                <p className="text-[10px] text-game-cyan/60 tracking-widest font-black">Success Rate</p>
                <p className="text-3xl font-black text-game-green">{wordsUnscrambled}</p>
             </div>
          </div>
          <Button onClick={startGame} className="w-full bg-game-cyan text-black font-black py-6 rounded-xl hover:bg-game-cyan/80">
            RESUME DECODING
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
          <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">Neural <span className="text-game-cyan">Decoder</span></h2>
          <p className="text-game-cyan/70 text-sm font-bold leading-relaxed max-w-[280px] mx-auto lowercase italic">
            Intercepted encrypted data streams. Use your cognitive overrides to unscramble and restore transmission.
          </p>
          <Button onClick={startGame} className="w-full bg-game-cyan text-black font-black py-6 rounded-xl">
            START DECODING
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Active game
  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4">
      {/* Top HUD */}
      <div className="flex items-center justify-between px-8 py-5 game-glass rounded-3xl uppercase">
         <div className="flex items-center gap-10">
            <div>
               <span className="text-[10px] font-black text-game-cyan/60 tracking-widest block">Data Load</span>
               <span className="font-black text-2xl text-foreground neon-text-cyan">{score}</span>
            </div>
            <div>
               <span className="text-[10px] font-black text-game-purple/60 tracking-widest block">Neural Streak</span>
               <span className="font-black text-2xl text-game-purple">{streak}x</span>
            </div>
         </div>
         <div className="text-3xl font-black text-foreground font-mono flex items-center gap-3">
            <span className={timeLeft < 10 ? "text-game-red animate-pulse" : "text-game-cyan"}>
               {formatTime(timeLeft)}
            </span>
         </div>
      </div>

      {/* Scrambled Word Frame */}
      <div className="p-16 game-glass rounded-3xl border-none relative overflow-hidden text-center space-y-8 min-h-[240px] flex flex-col justify-center">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="absolute top-4 left-4">
           <Brain className="text-game-cyan h-6 w-6 opacity-40 animate-pulse" />
        </div>
        
        {/* Relocated Mascot to bottom right of the main frame */}
        <div className="absolute bottom-4 right-4 z-20 opacity-30 pointer-events-none scale-75">
           <GameMascot state={mascotState} />
        </div>
        
        <p className="text-xs font-black text-game-cyan/40 tracking-[0.5em] uppercase">DECODING IN PROGRESS</p>
        
        <div className="flex justify-center gap-3 flex-wrap relative z-10">
          <AnimatePresence mode="popLayout">
            {scrambledWord.split("").map((letter, i) => (
              <motion.div
                key={`${roundId}-${i}`}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: i * 0.05 }}
                className="w-14 h-14 flex items-center justify-center game-glass border-game-cyan/20 text-game-cyan rounded-xl text-3xl font-black tracking-tighter uppercase neon-border-cyan"
              >
                {letter}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {showHint && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-game-green text-sm font-black tracking-widest uppercase"
          >
             <Lightbulb className="h-4 w-4" /> RECOVERY KEY: &quot;{currentWord[0]}&quot;
          </motion.div>
        )}
      </div>

      {/* Input Unit */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-game-cyan to-game-purple opacity-20 group-focus-within:opacity-50 blur transition-all duration-300 rounded-2xl" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="TYPE RESTORE SEQUENCE..."
          className="relative w-full p-8 text-2xl font-black text-center rounded-2xl border-none bg-game-void text-game-cyan placeholder:text-game-cyan/20 focus:outline-none tracking-widest uppercase"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      {/* Action Suite */}
      <div className="grid grid-cols-2 gap-4 uppercase font-black">
        <Button
          onClick={useHint}
          variant="outline"
          disabled={hints === 0 || showHint}
          className="h-16 rounded-2xl border-game-cyan/20 text-game-cyan hover:bg-game-cyan/10 flex gap-3 transition-all"
        >
          <Lightbulb className="h-5 w-5" /> RECOVERY HINT ({hints})
        </Button>
        <Button 
          onClick={skipWord} 
          variant="outline" 
          className="h-16 rounded-2xl border-foreground/10 text-foreground/40 hover:text-foreground hover:bg-foreground/5 flex gap-3 transition-all"
        >
          <SkipForward className="h-5 w-5" /> OVERRIDE LINK
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-game-cyan/20 tracking-[0.2em] uppercase">
         <Terminal className="h-3 w-3" /> NEURAL_BYPASS_ENABLED
      </div>

      {/* How to Play Section */}
      <div className="game-glass rounded-2xl p-6 border-none mt-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-game-cyan/10 rounded-lg">
            <Brain className="h-4 w-4 text-game-cyan" />
          </div>
          <h3 className="text-sm font-black text-foreground dark:text-white tracking-widest uppercase italic">Mission Protocol: Neural Decoder</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-bold text-foreground/60 dark:text-white/40 uppercase tracking-tighter">
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">01. Analyze</span>
             <span>Examine the scrambled letters in the central frame.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">02. Transmit</span>
             <span>Type the unscrambled word into the terminal and hit Enter.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">03. Overload</span>
             <span>Success builds your streak and increases potential score load.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
