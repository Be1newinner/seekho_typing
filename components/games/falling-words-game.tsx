"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomWord } from "@/lib/typing-utils";
import { GameMascot, MascotState } from "./game-mascot";
import { Box, Layers, Zap, Terminal, Shield } from "lucide-react";

interface FallingPacket {
  id: number;
  word: string;
  x: number;
  y: number;
  type: "data" | "system" | "virus";
}

export function FallingWordsGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [packets, setPackets] = useState<FallingPacket[]>([]);
  const [input, setInput] = useState("");
  const [wordsTyped, setWordsTyped] = useState(0);
  const [wordsMissed, setWordsMissed] = useState(0);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);
  const packetIdRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const spawnPacket = useCallback(() => {
    const types: ("data" | "system" | "virus")[] = ["data", "data", "system", "virus"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const newPacket: FallingPacket = {
      id: packetIdRef.current++,
      word: getRandomWord(),
      x: Math.random() * 80 + 10,
      y: -10,
      type,
    };
    setPackets((prev) => [...prev, newPacket]);
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    // Spawn new packets
    const spawnRate = Math.max(700, 2000 - Math.floor(score / 200) * 150);
    if (timestamp - lastSpawnRef.current > spawnRate) {
      spawnPacket();
      lastSpawnRef.current = timestamp;
    }

    // Update packet positions
    setPackets((prev) => {
      const speed = 0.2 + (score / 2000);
      const updated = prev.map((packet) => ({
        ...packet,
        y: packet.y + speed,
      }));

      // Check for packets that hit the bottom
      const remaining: FallingPacket[] = [];
      let livesLost = 0;
      let missed = 0;

      for (const packet of updated) {
        if (packet.y >= 100) {
          if (packet.type !== "virus") {
             livesLost++;
             missed++;
          }
        } else {
          remaining.push(packet);
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
        setWordsMissed((prev) => prev + missed);
        setMascotState("thinking");
      }

      return remaining;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [spawnPacket, score]);

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

    // Check if typed word matches any falling packet
    const matchIndex = packets.findIndex((p) => p.word.toLowerCase() === value);
    if (matchIndex !== -1) {
      const packet = packets[matchIndex];
      setPackets((prev) => prev.filter((_, i) => i !== matchIndex));
      
      let scoreGain = 10;
      if (packet.type === "system") scoreGain = 25;
      if (packet.type === "virus") {
         scoreGain = 50;
         setMascotState("happy");
         setTimeout(() => setMascotState("focused"), 1000);
      }

      setScore((prev) => prev + scoreGain);
      setWordsTyped((prev) => prev + 1);
      setInput("");
      
      if (scoreGain > 10) setMascotState("happy");
      else setMascotState("focused");
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setPackets([]);
    setInput("");
    setWordsTyped(0);
    setWordsMissed(0);
    setMascotState("focused");
    packetIdRef.current = 0;
    lastSpawnRef.current = performance.now();
  };

  const accuracy = wordsTyped + wordsMissed > 0 
    ? Math.round((wordsTyped / (wordsTyped + wordsMissed)) * 100) 
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
          <h2 className="text-4xl font-black text-game-red">SYSTEM CORRUPTED</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] text-game-cyan/60 tracking-widest font-black">Data Recovered</p>
              <p className="text-3xl font-black text-foreground">{wordsTyped}</p>
            </div>
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] text-game-cyan/60 tracking-widest font-black">Integrity Rank</p>
              <p className="text-3xl font-black text-game-green">{accuracy}%</p>
            </div>
          </div>
          <Button onClick={startGame} className="w-full bg-game-cyan text-black font-black py-6 rounded-xl hover:bg-game-cyan/80">
            RESTORE SYSTEM
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
          <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">Data <span className="text-game-cyan">Drop</span></h2>
          <p className="text-game-cyan/70 text-sm font-bold leading-relaxed max-w-[280px] mx-auto lowercase italic">
            Incoming data packets from the cloud. Intercept and decode them before they breach your system firewall.
          </p>
          <Button onClick={startGame} className="w-full bg-game-cyan text-black font-black py-6 rounded-xl">
            ENGAGE FIREWALL
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Active game
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-8 py-5 game-glass rounded-3xl uppercase">
        <div className="flex items-center gap-12">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-game-cyan/60 tracking-widest block">Network Load</span>
            <div className="flex items-center gap-2">
               <Layers className="h-4 w-4 text-game-cyan" />
               <span className="font-black text-2xl text-foreground">{score}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-game-purple/60 tracking-widest block">Decoded</span>
            <div className="flex items-center gap-2">
               <Box className="h-4 w-4 text-game-purple" />
               <span className="font-black text-2xl text-foreground">{wordsTyped}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-game-red/60 tracking-widest">Firewall</span>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: i < lives ? [1, 1.2, 1] : 1,
                  backgroundColor: i < lives ? "var(--game-neon-red)" : "var(--surface-highest)"
                }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                className={`w-4 h-4 rounded-sm rotate-45 border-none ${i < lives ? "shadow-[0_0_10px_var(--game-neon-red)]" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Game Frame */}
      <div
        className="relative w-full h-[500px] bg-game-void border border-game-cyan/20 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        <AnimatePresence>
          {packets.map((packet) => (
            <motion.div
              key={packet.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute pointer-events-none"
              style={{
                left: `${packet.x}%`,
                top: `${packet.y}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className={`
                flex flex-col items-center gap-2 p-1 rounded-xl border backdrop-blur-sm transition-colors shadow-lg
                ${packet.type === 'virus' ? 'border-game-red bg-game-red/20 dark:bg-game-red/10 animate-pulse' : 
                  packet.type === 'system' ? 'border-game-purple bg-game-purple/20 dark:bg-game-purple/10' : 
                  'border-foreground/10 bg-surface-lowest shadow-sm'}
              `}>
                <div className={`p-2 rounded-lg ${
                   packet.type === 'virus' ? 'bg-game-red/10' : 
                   packet.type === 'system' ? 'bg-game-purple/10' : 
                   'bg-foreground/5'
                }`}>
                   <span className="text-foreground dark:text-white font-black text-lg tracking-wider px-2">
                     {packet.word}
                   </span>
                </div>
                {packet.type === 'virus' && (
                  <div className="flex items-center gap-1 text-game-red text-[8px] font-black">
                     <Zap className="h-2 w-2" /> THREAT DETECTED
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Mascot fixed bottom right - subtle presence */}
        <div className="absolute bottom-4 right-4 z-20 opacity-30 pointer-events-none scale-75">
           <GameMascot state={mascotState} />
        </div>

        {/* Firewall indicator line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-game-red/50 to-transparent" />
      </div>

      {/* Control Unit */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-game-cyan to-game-purple opacity-20 group-focus-within:opacity-50 blur transition-all duration-300 rounded-2xl" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="ENTER PACKET HASH..."
          className="relative w-full p-8 text-2xl font-black text-center rounded-2xl border-none bg-game-void text-game-cyan placeholder:text-game-cyan/20 focus:outline-none tracking-widest uppercase"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-game-void border border-game-cyan/30 px-4 py-1 rounded-full text-[10px] font-black text-game-cyan/80 tracking-widest">
           DECRYPTOR MODULE v2.0
        </div>
      </div>
      {/* How to Play Section */}
      <div className="game-glass rounded-2xl p-6 border-none mt-12 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-game-cyan/10 rounded-lg">
             <Terminal className="h-4 w-4 text-game-cyan" />
          </div>
          <h3 className="text-sm font-black text-foreground dark:text-white tracking-widest uppercase italic">Mission Protocol: Data Drop</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-bold text-foreground/60 dark:text-white/40 uppercase tracking-tighter">
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">01. Intercept</span>
             <span>Type the words falling from the top of the monitor.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">02. Purge</span>
             <span>Matching a word instantly purges the data packet from your sector.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">03. Defense</span>
             <span>Don't let packets reach the bottom. System integrity (firewall) resets at zero.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
