"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FallingWordsGame } from "@/components/games/falling-words-game";
import { TimeChallengeGame } from "@/components/games/time-challenge-game";
import { WordScrambleGame } from "@/components/games/word-scramble-game";
import { TypingRaceGame } from "@/components/games/typing-race-game";
import { BalloonPopGame } from "@/components/games/balloon-pop-game";
import { MemoryTypeGame } from "@/components/games/memory-type-game";
import { SpeedBurstGame } from "@/components/games/speed-burst-game";
import { ArrowLeft, Gamepad2, Timer, Zap, Shuffle, Car, Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type GameType = 
  | "falling-words" 
  | "time-challenge" 
  | "word-scramble" 
  | "typing-race" 
  | "balloon-pop"
  | "memory-type"
  | "speed-burst"
  | null;

interface GameConfig {
  id: GameType;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  hint: string;
  component: React.ReactNode;
}

const GAMES: GameConfig[] = [
  {
    id: "falling-words",
    title: "Falling Words",
    description: "Words fall from the top of the screen. Type them correctly before they reach the bottom!",
    icon: <Zap className="h-5 w-5" />,
    iconColor: "text-yellow-500",
    hint: "Score points for each word",
    component: <FallingWordsGame />,
  },
  {
    id: "time-challenge",
    title: "Time Challenge",
    description: "Type as many words as you can within the time limit. Challenge yourself to beat your best score!",
    icon: <Timer className="h-5 w-5" />,
    iconColor: "text-blue-500",
    hint: "30 or 60 second modes",
    component: <TimeChallengeGame />,
  },
  {
    id: "word-scramble",
    title: "Word Scramble",
    description: "Unscramble the letters to form the correct word. Build streaks for bonus points!",
    icon: <Shuffle className="h-5 w-5" />,
    iconColor: "text-purple-500",
    hint: "Use hints wisely",
    component: <WordScrambleGame />,
  },
  {
    id: "typing-race",
    title: "Typing Race",
    description: "Race against a virtual opponent! Type the sentence faster than them to win.",
    icon: <Car className="h-5 w-5" />,
    iconColor: "text-green-500",
    hint: "Choose easy, medium or hard",
    component: <TypingRaceGame />,
  },
  {
    id: "balloon-pop",
    title: "Balloon Pop",
    description: "Balloons float up with words on them. Type the word to pop the balloon before it escapes!",
    icon: <Sparkles className="h-5 w-5" />,
    iconColor: "text-pink-500",
    hint: "Build combos for bonus points",
    component: <BalloonPopGame />,
  },
  {
    id: "memory-type",
    title: "Memory Type",
    description: "A word appears briefly. Memorize it, then type it after it disappears! Test your memory and typing!",
    icon: <Brain className="h-5 w-5" />,
    iconColor: "text-orange-500",
    hint: "Multiple difficulty levels",
    component: <MemoryTypeGame />,
  },
  {
    id: "speed-burst",
    title: "Speed Burst",
    description: "3 rounds of 10-second typing bursts! Type as many words as you can in each burst.",
    icon: <Zap className="h-5 w-5" />,
    iconColor: "text-red-500",
    hint: "Beat your best WPM",
    component: <SpeedBurstGame />,
  },
];

export function GamesSection() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  const selectedGameConfig = GAMES.find((g) => g.id === selectedGame);

  if (selectedGameConfig) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedGame(null)}
          className="gap-2 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/5 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-semibold text-xs uppercase tracking-widest">Back to Arcade</span>
        </Button>
        
        {selectedGameConfig.component}
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-black tracking-tight text-foreground">Typing Arcade</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl leading-relaxed font-medium">
          Where mastery meets play. Sharpen your reflexes with our <span className="text-primary font-bold">7 premium game modes</span> designed for elite speed training.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {GAMES.map((game) => (
          <Card
            key={game.id}
            className="group cursor-pointer border-none bg-surface-lowest shadow-xl shadow-black/[0.02] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:translate-y-[-8px] overflow-hidden flex flex-col"
            onClick={() => setSelectedGame(game.id)}
          >
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl bg-opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm", game.iconColor.replace('text-', 'bg-'))}>
                  {game.icon}
                </div>
                <div className="px-2 py-0.5 bg-surface-low rounded text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  {game.hint.split(' ')[0]}
                </div>
              </div>
              <CardTitle className="text-xl font-bold tracking-tight">{game.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between space-y-6">
              <CardDescription className="text-xs font-semibold leading-relaxed text-muted-foreground/80 italic">
                {game.description}
              </CardDescription>
              
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  <Gamepad2 className="h-3.5 w-3.5" />
                  <span>{game.hint}</span>
                </div>
                <Button size="sm" className="rounded-full px-5 font-black text-[10px] uppercase tracking-wider group-hover:shadow-lg group-hover:shadow-primary/10 transition-all">
                  Launch
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
