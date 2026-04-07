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
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedGame(null)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Games
        </Button>
        
        {selectedGameConfig.component}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Typing Games</h2>
        <p className="text-muted-foreground">
          Fun games to practice typing while having fun - Choose from 7 exciting games!
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        {GAMES.map((game) => (
          <Card
            key={game.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
            onClick={() => setSelectedGame(game.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className={game.iconColor}>{game.icon}</span>
                <CardTitle className="text-lg">{game.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-sm line-clamp-2">
                {game.description}
              </CardDescription>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gamepad2 className="h-4 w-4" />
                <span>{game.hint}</span>
              </div>
              <Button className="w-full" size="sm">Play Game</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
