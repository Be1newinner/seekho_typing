"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomWord } from "@/lib/typing-utils";
import { GameMascot, MascotState } from "./game-mascot";
import { Share2, Zap, Activity, ShieldAlert, Cpu, Terminal } from "lucide-react";

interface Node {
  id: number;
  word: string;
  x: number;
  y: number;
  status: "pending" | "fixed" | "breached";
}

interface Pulse {
  id: number;
  fromId: number;
  toId: number;
  progress: number; // 0 to 1
}

export function NeuralLinkGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [input, setInput] = useState("");
  const [linksFixed, setLinksFixed] = useState(0);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodeIdRef = useRef(0);
  const pulseIdRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const spawnNode = useCallback(() => {
    const parentNode = nodes.length > 0 ? nodes[Math.floor(Math.random() * nodes.length)] : null;
    
    let x, y;
    if (!parentNode) {
      x = 50;
      y = 50;
    } else {
      const angle = Math.random() * Math.PI * 2;
      const distance = 25 + Math.random() * 15;
      x = Math.max(10, Math.min(90, parentNode.x + Math.cos(angle) * distance));
      y = Math.max(10, Math.min(80, parentNode.y + Math.sin(angle) * distance));
    }

    const newNode: Node = {
      id: nodeIdRef.current++,
      word: getRandomWord(),
      x,
      y,
      status: "pending",
    };

    setNodes((prev) => [...prev, newNode]);

    if (parentNode) {
      const newPulse: Pulse = {
        id: pulseIdRef.current++,
        fromId: parentNode.id,
        toId: newNode.id,
        progress: 0,
      };
      setPulses((prev) => [...prev, newPulse]);
    }
  }, [nodes]);

  const gameLoop = useCallback((timestamp: number) => {
    // Spawn rate based on score
    const spawnRate = Math.max(1200, 3000 - Math.floor(score / 50) * 200);
    if (timestamp - lastSpawnRef.current > spawnRate && nodes.length < 8) {
      spawnNode();
      lastSpawnRef.current = timestamp;
    }

    // Update pulses
    setPulses((prev) => {
      const speed = 0.002 + (score / 10000);
      const updated = prev.map((p) => ({ ...p, progress: p.progress + speed }));
      
      const finished = updated.filter((p) => p.progress >= 1);
      if (finished.length > 0) {
        setNodes((nodesPrev) => {
          let energyLoss = 0;
          const newNodes = nodesPrev.map((node) => {
            const isTarget = finished.some((p) => p.toId === node.id);
            if (isTarget && node.status === "pending") {
              energyLoss += 15;
              return { ...node, status: "breached" as const };
            }
            return node;
          });

          if (energyLoss > 0) {
            setEnergy((e) => {
              const newE = e - energyLoss;
              if (newE <= 0) {
                setGameOver(true);
                setMascotState("sad");
              }
              return Math.max(0, newE);
            });
            setMascotState("thinking");
          }
          return newNodes;
        });

        // Remove finished pulses and also remove the target node after a delay if breached
        return updated.filter((p) => p.progress < 1);
      }
      return updated;
    });

    // Cleanup dead nodes (breached or fixed for a while)
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [spawnNode, nodes.length, score]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
      inputRef.current?.focus();
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted, gameOver, gameLoop]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInput(value);

    const matchIndex = nodes.findIndex((n) => n.word.toLowerCase() === value && n.status === "pending");
    if (matchIndex !== -1) {
      const node = nodes[matchIndex];
      setNodes((prev) => prev.map((n) => n.id === node.id ? { ...n, status: "fixed" } : n));
      
      // Cleanup node and its pulses after delay
      setTimeout(() => {
        setNodes((prev) => prev.filter((n) => n.id !== node.id));
        setPulses((prev) => prev.filter((p) => p.fromId !== node.id && p.toId !== node.id));
      }, 1000);

      setScore((prev) => prev + 25);
      setLinksFixed((prev) => prev + 1);
      setEnergy((e) => Math.min(100, e + 5));
      setInput("");
      setMascotState("happy");
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setEnergy(100);
    setNodes([{ id: nodeIdRef.current++, word: "MASTER", x: 50, y: 50, status: "fixed" }]);
    setPulses([]);
    setInput("");
    setLinksFixed(0);
    setMascotState("focused");
    lastSpawnRef.current = performance.now();
  };

  if (gameOver) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden text-center uppercase">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <CardContent className="space-y-6 pt-10 relative z-10">
          <div className="flex justify-center mb-4">
             <GameMascot state="sad" />
          </div>
          <h2 className="text-4xl font-black text-game-red">LINK DISCONNECTED</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] text-game-cyan/60 tracking-widest font-black">Neural Gain</p>
              <p className="text-3xl font-black text-foreground">{score}</p>
            </div>
            <div className="p-4 bg-surface-low/60 dark:bg-black/40 rounded-xl border border-white/5">
              <p className="text-[10px] text-game-cyan/60 tracking-widest font-black">Nodes Fixed</p>
              <p className="text-3xl font-black text-game-green">{linksFixed}</p>
            </div>
          </div>
          <Button onClick={startGame} className="w-full bg-game-cyan text-black font-black py-6 rounded-xl hover:bg-game-cyan/80">
            RESTORE LINK
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!gameStarted) {
    return (
      <Card className="max-w-md mx-auto game-glass border-none overflow-hidden uppercase">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <CardContent className="space-y-6 pt-10 relative z-10 text-center">
          <div className="flex justify-center mb-4">
             <GameMascot state="idle" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">Neural <span className="text-game-cyan">Link</span></h2>
          <p className="text-game-cyan/70 text-sm font-bold leading-relaxed max-w-[280px] mx-auto lowercase italic">
            Amplify the signal through the neural network. Fix nodes before the pulse breaches them.
          </p>
          <Button onClick={startGame} className="w-full bg-game-cyan text-black font-black py-6 rounded-xl">
            ESTABLISH LINK
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto uppercase">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-8 py-5 game-glass rounded-3xl">
        <div className="flex items-center gap-12">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-game-cyan/60 tracking-widest block">Signal Strength</span>
            <div className="flex items-center gap-2">
               <Activity className="h-4 w-4 text-game-cyan" />
               <span className="font-black text-2xl text-foreground">{score}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 w-48">
          <span className="text-[10px] font-black text-game-red/60 tracking-widest">Neural Stability</span>
          <div className="w-full h-2 bg-foreground/5 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-game-red shadow-[0_0_10px_var(--game-neon-red)]"
               animate={{ width: `${energy}%` }}
             />
          </div>
        </div>
      </div>

      {/* Main Game Frame */}
      <div className="relative w-full h-[500px] bg-game-void border border-game-cyan/20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        {/* Connections Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {pulses.map((pulse) => {
            const from = nodes.find(n => n.id === pulse.fromId);
            const to = nodes.find(n => n.id === pulse.toId);
            if (!from || !to) return null;
            return (
              <g key={pulse.id}>
                <line 
                  x1={`${from.x}%`} y1={`${from.y}%`} 
                  x2={`${to.x}%`} y2={`${to.y}%`} 
                  stroke="currentColor" 
                  className="text-foreground/10" 
                  strokeWidth="2" 
                />
                <motion.circle 
                  cx={`${from.x + (to.x - from.x) * pulse.progress}%`} 
                  cy={`${from.y + (to.y - from.y) * pulse.progress}%`} 
                  r="4" 
                  className="fill-game-cyan shadow-[0_0_10px_var(--game-neon-cyan)]"
                />
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className={`
                flex flex-col items-center gap-2 p-3 rounded-2xl border backdrop-blur-sm transition-all shadow-xl
                ${node.status === 'breached' ? 'border-game-red bg-game-red/20 neon-border-red' : 
                  node.status === 'fixed' ? 'border-game-green bg-game-green/20 neon-border-green' : 
                  'border-game-cyan/30 bg-surface-lowest'}
              `}>
                 <span className={`font-black text-sm tracking-widest ${node.status === 'pending' ? 'text-foreground' : 'text-white'}`}>
                   {node.word}
                 </span>
                 {node.status === 'breached' && <ShieldAlert className="h-4 w-4 text-game-red animate-pulse" />}
                 {node.status === 'fixed' && <Zap className="h-4 w-4 text-game-green" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="absolute bottom-4 right-4 z-20 opacity-30 pointer-events-none scale-75">
           <GameMascot state={mascotState} />
        </div>
      </div>

      {/* Input Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-game-cyan to-game-purple opacity-20 group-focus-within:opacity-50 blur transition-all duration-300 rounded-2xl" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="AMPLIFY NODE SEQUENCE..."
          className="relative w-full p-8 text-2xl font-black text-center rounded-2xl border-none bg-game-void text-game-cyan placeholder:text-game-cyan/20 focus:outline-none tracking-widest uppercase"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      {/* How to Play Section */}
      <div className="game-glass rounded-2xl p-6 border-none mt-12 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-game-cyan/10 rounded-lg">
             <Share2 className="h-4 w-4 text-game-cyan" />
          </div>
          <h3 className="text-sm font-black text-foreground dark:text-white tracking-widest uppercase italic">Mission Protocol: Neural Link</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-bold text-foreground/60 dark:text-white/40 uppercase tracking-tighter">
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">01. Track</span>
             <span>Watch the glowing pulses travel between neural nodes.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">02. Fix</span>
             <span>Type the word on a target node before the pulse breaches it.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-foreground/5 rounded-xl">
             <span className="text-game-cyan">03. Amplify</span>
             <span>Fixed nodes recover energy and increase your overall signal strength.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
