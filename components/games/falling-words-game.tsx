"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRandomWord } from "@/lib/typing-utils";

interface FallingWord {
  id: number;
  word: string;
  x: number;
  y: number;
}

export function FallingWordsGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState("");
  const [wordsTyped, setWordsTyped] = useState(0);
  const [wordsMissed, setWordsMissed] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const wordIdRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const spawnWord = useCallback(() => {
    const newWord: FallingWord = {
      id: wordIdRef.current++,
      word: getRandomWord(),
      x: Math.random() * 80 + 10, // 10-90% horizontal position
      y: 0,
    };
    setWords((prev) => [...prev, newWord]);
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    // Spawn new words
    if (timestamp - lastSpawnRef.current > 2000) {
      spawnWord();
      lastSpawnRef.current = timestamp;
    }

    // Update word positions
    setWords((prev) => {
      const updated = prev.map((word) => ({
        ...word,
        y: word.y + 0.3, // Falling speed
      }));

      // Check for words that hit the bottom
      const remaining: FallingWord[] = [];
      let livesLost = 0;
      let missed = 0;

      for (const word of updated) {
        if (word.y >= 100) {
          livesLost++;
          missed++;
        } else {
          remaining.push(word);
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
        setWordsMissed((prev) => prev + missed);
      }

      return remaining;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [spawnWord]);

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

    // Check if typed word matches any falling word
    const matchIndex = words.findIndex((w) => w.word.toLowerCase() === value);
    if (matchIndex !== -1) {
      setWords((prev) => prev.filter((_, i) => i !== matchIndex));
      setScore((prev) => prev + 10);
      setWordsTyped((prev) => prev + 1);
      setInput("");
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setWords([]);
    setInput("");
    setWordsTyped(0);
    setWordsMissed(0);
    wordIdRef.current = 0;
    lastSpawnRef.current = 0;
  };

  const accuracy = wordsTyped + wordsMissed > 0 
    ? Math.round((wordsTyped / (wordsTyped + wordsMissed)) * 100) 
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
              <p className="text-sm text-muted-foreground">Words Typed</p>
              <p className="text-3xl font-bold text-foreground">{wordsTyped}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Words Missed</p>
              <p className="text-3xl font-bold text-red-500">{wordsMissed}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-3xl font-bold text-foreground">{accuracy}%</p>
            </div>
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
          <CardTitle className="text-center text-2xl">Falling Words</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Words will fall from the top. Type each word correctly before it reaches the bottom. You have 3 lives!
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
            <span className="text-sm text-muted-foreground">Words: </span>
            <span className="font-bold text-lg">{wordsTyped}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
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
        className="relative w-full h-[400px] bg-gradient-to-b from-muted/30 to-muted border rounded-lg overflow-hidden"
      >
        {words.map((word) => (
          <div
            key={word.id}
            className="absolute px-3 py-1 bg-primary text-primary-foreground rounded-full font-mono text-lg font-medium shadow-md transition-all"
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              transform: "translateX(-50%)",
            }}
          >
            {word.word}
          </div>
        ))}
        
        {/* Bottom line indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500/50" />
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInput}
        placeholder="Type the falling words..."
        className="w-full p-4 text-xl font-mono text-center rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}
