"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Flag } from "lucide-react";

const RACE_SENTENCES = [
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "She sells seashells by the seashore every summer morning.",
  "A journey of a thousand miles begins with a single step forward.",
  "Practice makes perfect when you dedicate time every single day.",
  "The early bird catches the worm but the night owl has its charm.",
  "Knowledge is power and education opens doors to new possibilities.",
  "Hard work and dedication always lead to success in the end.",
  "Every expert was once a beginner who never gave up trying.",
  "The pen is mightier than the sword in shaping public opinion.",
  "Actions speak louder than words so let your work do the talking.",
];

type Difficulty = "easy" | "medium" | "hard";

const OPPONENT_SPEEDS: Record<Difficulty, number> = {
  easy: 25,    // 25 WPM
  medium: 40,  // 40 WPM
  hard: 60,    // 60 WPM
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
          const newProgress = prev + charsPerSecond;
          if (newProgress >= targetText.length) {
            setGameOver(true);
            setWinner((w) => w || "opponent");
            setEndTime(Date.now());
            return targetText.length;
          }
          return newProgress;
        });
      }, 1000);
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
    setInput(value);
    setPlayerProgress(value.length);

    // Check if player finished
    if (value === targetText) {
      setGameOver(true);
      setWinner("player");
      setEndTime(Date.now());
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
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-16">
          <div className="text-center">
            <p className="text-6xl font-bold text-primary animate-pulse">
              {countdown === 0 ? "GO!" : countdown}
            </p>
            <p className="text-muted-foreground mt-4">Get ready to type!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Game over screen
  if (gameOver) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {winner === "player" ? "You Won!" : "Opponent Won!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg text-center ${
            winner === "player" 
              ? "bg-green-100 dark:bg-green-900/30" 
              : "bg-red-100 dark:bg-red-900/30"
          }`}>
            <p className="text-lg font-medium">
              {winner === "player" 
                ? "Congratulations! You beat the opponent!" 
                : "The opponent was faster this time. Try again!"}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Your Speed</p>
              <p className="text-3xl font-bold text-foreground">{playerWPM} WPM</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="text-3xl font-bold text-foreground">{timeTaken}s</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={() => startGame("easy")} variant="outline" className="w-full">
              Easy Race (25 WPM)
            </Button>
            <Button onClick={() => startGame("medium")} className="w-full">
              Medium Race (40 WPM)
            </Button>
            <Button onClick={() => startGame("hard")} variant="secondary" className="w-full">
              Hard Race (60 WPM)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Typing Race</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Race against a virtual opponent! Type the sentence faster than them to win. Choose your difficulty level.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => startGame("easy")} variant="outline" className="w-full">
              Easy (25 WPM opponent)
            </Button>
            <Button onClick={() => startGame("medium")} className="w-full">
              Medium (40 WPM opponent)
            </Button>
            <Button onClick={() => startGame("hard")} variant="secondary" className="w-full">
              Hard (60 WPM opponent)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active game
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Race track */}
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        {/* Player track */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-green-600 dark:text-green-400">You</span>
            <span className="text-muted-foreground">{Math.round(playerPercent)}%</span>
          </div>
          <div className="relative h-8 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-green-500/30 transition-all duration-200"
              style={{ width: `${playerPercent}%` }}
            />
            <div 
              className="absolute top-1 transition-all duration-200"
              style={{ left: `calc(${Math.min(playerPercent, 95)}% - 12px)` }}
            >
              <Car className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <Flag className="absolute right-2 top-1 h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        {/* Opponent track */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-red-600 dark:text-red-400">Opponent ({difficulty})</span>
            <span className="text-muted-foreground">{Math.round(opponentPercent)}%</span>
          </div>
          <div className="relative h-8 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-red-500/30 transition-all duration-1000"
              style={{ width: `${opponentPercent}%` }}
            />
            <div 
              className="absolute top-1 transition-all duration-1000"
              style={{ left: `calc(${Math.min(opponentPercent, 95)}% - 12px)` }}
            >
              <Car className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <Flag className="absolute right-2 top-1 h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Target text */}
      <div className="p-4 bg-background border rounded-lg">
        <p className="text-lg font-mono leading-relaxed">
          {targetText.split("").map((char, i) => {
            let className = "text-muted-foreground";
            if (i < input.length) {
              className = input[i] === char 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
            } else if (i === input.length) {
              className = "bg-primary/20 text-foreground";
            }
            return (
              <span key={i} className={className}>
                {char}
              </span>
            );
          })}
        </p>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInput}
        placeholder="Start typing..."
        className="w-full p-4 text-lg font-mono rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}
