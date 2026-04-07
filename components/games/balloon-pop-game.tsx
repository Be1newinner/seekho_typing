"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRandomWord } from "@/lib/typing-utils";

interface Balloon {
  id: number;
  word: string;
  x: number;
  y: number;
  color: string;
}

const BALLOON_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
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
  
  const inputRef = useRef<HTMLInputElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const balloonIdRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const spawnBalloon = useCallback(() => {
    const newBalloon: Balloon = {
      id: balloonIdRef.current++,
      word: getRandomWord(),
      x: Math.random() * 70 + 15, // 15-85% horizontal position
      y: 100, // Start at bottom
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
    };
    setBalloons((prev) => [...prev, newBalloon]);
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    // Spawn new balloons
    if (timestamp - lastSpawnRef.current > 1800) {
      spawnBalloon();
      lastSpawnRef.current = timestamp;
    }

    // Update balloon positions (floating up)
    setBalloons((prev) => {
      const updated = prev.map((balloon) => ({
        ...balloon,
        y: balloon.y - 0.25, // Float up speed
      }));

      // Check for balloons that escaped at the top
      const remaining: Balloon[] = [];
      let livesLost = 0;
      let missed = 0;

      for (const balloon of updated) {
        if (balloon.y <= -10) {
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
          }
          return Math.max(0, newLives);
        });
        setBalloonsMissed((prev) => prev + missed);
        setCombo(0);
      }

      return remaining;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [spawnBalloon]);

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
    const matchIndex = balloons.findIndex((b) => b.word.toLowerCase() === value);
    if (matchIndex !== -1) {
      setBalloons((prev) => prev.filter((_, i) => i !== matchIndex));
      const newCombo = combo + 1;
      const comboBonus = Math.floor(newCombo / 3) * 5;
      setScore((prev) => prev + 10 + comboBonus);
      setBalloonsPopped((prev) => prev + 1);
      setCombo(newCombo);
      if (newCombo > bestCombo) {
        setBestCombo(newCombo);
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
    balloonIdRef.current = 0;
    lastSpawnRef.current = 0;
  };

  const accuracy = balloonsPopped + balloonsMissed > 0 
    ? Math.round((balloonsPopped / (balloonsPopped + balloonsMissed)) * 100) 
    : 0;

  // Game over screen
  if (gameOver) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Game Over!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-3xl font-bold text-foreground">{score}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Balloons Popped</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{balloonsPopped}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Escaped</p>
              <p className="text-3xl font-bold text-red-500">{balloonsMissed}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Best Combo</p>
              <p className="text-3xl font-bold text-orange-500">{bestCombo}</p>
            </div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Accuracy: <span className="font-bold">{accuracy}%</span>
            </p>
          </div>
          <Button onClick={startGame} className="w-full" size="lg">
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Balloon Pop</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Balloons float up with words on them. Type the word to pop the balloon before it escapes! Build combos for bonus points. You have 5 lives!
          </p>
          <Button onClick={startGame} className="w-full" size="lg">
            Start Game
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Active game
  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-lg">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Score: </span>
            <span className="font-bold text-lg">{score}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Combo: </span>
            <span className="font-bold text-lg text-orange-500">{combo}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-xl ${i < lives ? "text-red-500" : "text-muted-foreground/30"}`}
            >
              &#9829;
            </span>
          ))}
        </div>
      </div>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="relative w-full h-[400px] bg-gradient-to-b from-sky-200 to-sky-400 dark:from-sky-900 dark:to-sky-700 border rounded-lg overflow-hidden"
      >
        {/* Clouds decoration */}
        <div className="absolute top-4 left-8 w-16 h-8 bg-white/60 rounded-full" />
        <div className="absolute top-8 left-12 w-12 h-6 bg-white/60 rounded-full" />
        <div className="absolute top-6 right-12 w-20 h-10 bg-white/60 rounded-full" />
        <div className="absolute top-12 right-16 w-14 h-7 bg-white/60 rounded-full" />
        
        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            className="absolute transition-all"
            style={{
              left: `${balloon.x}%`,
              bottom: `${balloon.y}%`,
              transform: "translateX(-50%)",
            }}
          >
            {/* Balloon */}
            <div className={`relative ${balloon.color} rounded-full w-20 h-24 flex items-center justify-center shadow-lg`}>
              <span className="text-white font-mono font-bold text-sm px-1 text-center break-all">
                {balloon.word}
              </span>
              {/* Balloon knot */}
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 ${balloon.color} rotate-45`} />
            </div>
            {/* String */}
            <div className="w-px h-8 bg-gray-400 mx-auto" />
          </div>
        ))}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInput}
        placeholder="Type to pop balloons..."
        className="w-full p-4 text-xl font-mono text-center rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}
