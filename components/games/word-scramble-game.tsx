"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRandomWord, formatTime } from "@/lib/typing-utils";

const GAME_DURATION = 60;

function scrambleWord(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const scrambled = arr.join("");
  // Make sure it's actually scrambled
  return scrambled === word ? scrambleWord(word) : scrambled;
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
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewWord = useCallback(() => {
    const word = getRandomWord();
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setInput("");
    setShowHint(false);
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
    generateNewWord();
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [generateNewWord]);

  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedInput = input.trim().toLowerCase();
      
      if (trimmedInput === currentWord.toLowerCase()) {
        const points = 10 + (streak * 2); // Bonus for streaks
        setScore((prev) => prev + points);
        setWordsUnscrambled((prev) => prev + 1);
        setStreak((prev) => {
          const newStreak = prev + 1;
          if (newStreak > bestStreak) {
            setBestStreak(newStreak);
          }
          return newStreak;
        });
        generateNewWord();
      } else if (trimmedInput.length > 0) {
        setStreak(0);
        setInput("");
      }
    }
  };

  const useHint = () => {
    if (hints > 0 && !showHint) {
      setHints((prev) => prev - 1);
      setShowHint(true);
    }
  };

  const skipWord = () => {
    setStreak(0);
    generateNewWord();
  };

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
              <p className="text-sm text-muted-foreground">Words Solved</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{wordsUnscrambled}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg col-span-2">
              <p className="text-sm text-muted-foreground">Best Streak</p>
              <p className="text-3xl font-bold text-foreground">{bestStreak}</p>
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
          <CardTitle className="text-center text-2xl">Word Scramble</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Unscramble the letters to form the correct word. Build streaks for bonus points! You have 3 hints to reveal the first letter.
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
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Stats bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Score: </span>
            <span className="font-bold text-lg">{score}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Streak: </span>
            <span className="font-bold text-lg text-orange-500">{streak}</span>
          </div>
        </div>
        <div className="text-2xl font-mono font-bold text-foreground">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Scrambled word display */}
      <div className="p-8 bg-muted/50 border rounded-xl text-center space-y-4">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">Unscramble this word</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {scrambledWord.split("").map((letter, i) => (
            <span
              key={i}
              className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-lg text-2xl font-mono font-bold uppercase"
            >
              {letter}
            </span>
          ))}
        </div>
        {showHint && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Hint: First letter is &quot;{currentWord[0].toUpperCase()}&quot;
          </p>
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Type the word and press Enter..."
        className="w-full p-4 text-xl font-mono text-center rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary uppercase"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={useHint}
          variant="outline"
          disabled={hints === 0 || showHint}
          className="flex-1"
        >
          Hint ({hints})
        </Button>
        <Button onClick={skipWord} variant="ghost" className="flex-1">
          Skip Word
        </Button>
      </div>
    </div>
  );
}
