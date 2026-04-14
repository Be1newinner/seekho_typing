"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FallingWordsGame } from "@/components/games/falling-words-game";
import { WordScrambleGame } from "@/components/games/word-scramble-game";
import { TypingRaceGame } from "@/components/games/typing-race-game";
import { BalloonPopGame } from "@/components/games/balloon-pop-game";
import { MemoryTypeGame } from "@/components/games/memory-type-game";
import { SpeedBurstGame } from "@/components/games/speed-burst-game";
import { TimeChallengeGame } from "@/components/games/time-challenge-game";
import { NeuralLinkGame } from "@/components/games/neural-link-game";
import { ArrowLeft, Gamepad2, Zap, Shuffle, Cpu, Sparkles, Terminal, Activity, Brain, Clock, Gauge, Share2 } from "lucide-react";

type GameType = 
  | "falling-words" 
  | "word-scramble" 
  | "typing-race" 
  | "balloon-pop"
  | "memory-type"
  | "speed-burst"
  | "time-challenge"
  | "neural-link"
  | null;

interface GameConfig {
  id: GameType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  tag: string;
  component: React.ReactNode;
}

const GAMES: GameConfig[] = [
  {
    id: "balloon-pop",
    title: "Balloon Pop",
    description: "Neutralize rising data balloons. Build combos for power-ups and score multipliers.",
    icon: <Sparkles className="h-6 w-6" />,
    color: "game-cyan",
    tag: "Reflex",
    component: <BalloonPopGame />,
  },
  {
    id: "typing-race",
    title: "Neural Race",
    description: "Race against a high-speed AI core. Synchronize your throughput to achieve victory.",
    icon: <Cpu className="h-6 w-6" />,
    color: "game-purple",
    tag: "Speed",
    component: <TypingRaceGame />,
  },
  {
    id: "falling-words",
    title: "Data Drop",
    description: "Intercept and decode falling data packets before they breach system firewalls.",
    icon: <Zap className="h-6 w-6" />,
    color: "game-green",
    tag: "Tactical",
    component: <FallingWordsGame />,
  },
  {
    id: "word-scramble",
    title: "Neural Decoder",
    description: "Restore corrupted data streams by unscrambling neural word sequences.",
    icon: <Shuffle className="h-6 w-6" />,
    color: "game-red",
    tag: "Cognitive",
    component: <WordScrambleGame />,
  },
  {
    id: "memory-type",
    title: "Buffer Memory",
    description: "Visual data packets will flash briefly. Retain and transmit the sequence into the main frame.",
    icon: <Brain className="h-6 w-6" />,
    color: "game-cyan",
    tag: "Visual",
    component: <MemoryTypeGame />,
  },
  {
    id: "speed-burst",
    title: "Overload Burst",
    description: "High-intensity 10-second throughput tests. Push your neural core to the absolute limit.",
    icon: <Gauge className="h-6 w-6" />,
    color: "game-purple",
    tag: "Intensity",
    component: <SpeedBurstGame />,
  },
  {
    id: "time-challenge",
    title: "System Stress",
    description: "Extended sustained throughput test. Maintain high precision under constant time pressure.",
    icon: <Clock className="h-6 w-6" />,
    color: "game-red",
    tag: "Stamina",
    component: <TimeChallengeGame />,
  },
  {
    id: "neural-link",
    title: "Neural Link",
    description: "Amplify the signal through the neural network. Fix nodes before the pulse breaches them.",
    icon: <Share2 className="h-6 w-6" />,
    color: "game-cyan",
    tag: "Synapse",
    component: <NeuralLinkGame />,
  },
];

export function GamesSection() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  const selectedGameConfig = GAMES.find((g) => g.id === selectedGame);

  if (selectedGameConfig) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedGame(null)}
          className="gap-2 text-game-cyan hover:bg-game-cyan/10 rounded-full transition-all border border-game-cyan/20 px-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-black text-[10px] uppercase tracking-[0.2em]">Exit to Nebula Hub</span>
        </Button>
        
        <div className="pt-4">
          {selectedGameConfig.component}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 min-h-[600px] flex flex-col justify-center">
      <div className="space-y-6 text-center max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 game-glass rounded-full border-game-cyan/30">
          <Activity className="h-4 w-4 text-game-cyan animate-pulse" />
          <span className="text-[10px] font-black text-game-cyan tracking-[0.3em] uppercase">System Arcade v4.0</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-5xl font-black tracking-tighter text-foreground italic uppercase">
            Nebula <span className="text-game-cyan neon-text-cyan">Protocol</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed font-bold tracking-tight">
            Select a neural training module to begin system optimization.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto w-full px-4">
        {GAMES.map((game) => (
          <Card
            key={game.id}
            className="group cursor-pointer border-none game-glass transition-all duration-500 hover:scale-[1.02] active:scale-95 overflow-hidden flex flex-col min-h-[220px]"
            onClick={() => setSelectedGame(game.id)}
          >
            <div className="absolute inset-0 cyber-grid opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${game.color} opacity-20 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(0,229,255,0.5)]`} />
            
            <CardHeader className="p-8 pb-4 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-4 rounded-2xl bg-${game.color}/10 text-${game.color} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                  {game.icon}
                </div>
                <div className="flex flex-col items-end gap-1">
                   <div className={`px-3 py-1 bg-${game.color}/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-${game.color}`}>
                     {game.tag}
                   </div>
                    <div className="text-[8px] font-bold text-foreground/20 dark:text-white/20 uppercase tracking-tighter">Latency: 0.1ms</div>
                 </div>
              </div>
              <CardTitle className="text-2xl font-black tracking-tight text-foreground dark:text-white uppercase group-hover:text-game-cyan transition-colors italic">
                {game.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 flex-grow flex flex-col justify-between space-y-4 relative z-10">
              <p className="text-sm font-medium leading-relaxed text-muted-foreground/80 lowercase italic">
                {game.description}
              </p>
              
              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 dark:text-white/30">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Module Initialized</span>
                </div>
                <Button size="sm" className={`bg-${game.color} hover:bg-${game.color}/80 text-black font-black text-[10px] px-8 rounded-lg uppercase tracking-widest shadow-lg shadow-${game.color}/20`}>
                  Execute
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pb-8">
         <p className="text-[10px] font-black text-foreground/10 dark:text-white/10 tracking-[0.5em] uppercase">All modules are sandboxed and secure</p>
      </div>
    </div>
  );
}
