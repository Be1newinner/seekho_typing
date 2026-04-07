"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRandomWord, formatTime } from "@/lib/typing-utils";

type Duration = 30 | 60;

export function TimeChallengeGame() {
  const [duration, setDuration] = useState<Duration>(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewWord = useCallback(() => {
    setCurrentWord(getRandomWord());
    setInput("");
  }, []);

  const startGame = useCallback((selectedDuration: Duration) => {
    setDuration(selectedDuration);
    setTimeLeft(selectedDuration);
    setGameStarted(true);
    setGameOver(false);
    setCorrectWords(0);
    setIncorrectWords(0);
    setTotalCharacters(0);
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
    const value = e.target.value;
    setInput(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const trimmedInput = input.trim().toLowerCase();
      
      if (trimmedInput === currentWord.toLowerCase()) {
        setCorrectWords((prev) => prev + 1);
        setTotalCharacters((prev) => prev + currentWord.length);
      } else if (trimmedInput.length > 0) {
        setIncorrectWords((prev) => prev + 1);
        setTotalCharacters((prev) => prev + trimmedInput.length);
      }
      
      generateNewWord();
    }
  };

  const accuracy = correctWords + incorrectWords > 0
    ? Math.round((correctWords / (correctWords + incorrectWords)) * 100)
    : 0;

  const wpm = duration > 0
    ? Math.round((correctWords / (duration / 60)))
    : 0;

  const cpm = duration > 0
    ? Math.round((totalCharacters / (duration / 60)))
    : 0;

  // Game over screen
  if (gameOver) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Time&apos;s Up!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Correct Words</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{correctWords}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Incorrect Words</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{incorrectWords}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-3xl font-bold text-foreground">{accuracy}%</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Words/Min</p>
              <p className="text-3xl font-bold text-foreground">{wpm}</p>
            </div>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Characters per minute: <span className="font-bold">{cpm}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => startGame(30)} className="flex-1" size="lg">
              30 Seconds
            </Button>
            <Button onClick={() => startGame(60)} className="flex-1" size="lg">
              60 Seconds
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
          <CardTitle className="text-center text-2xl">Time Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Type as many words as you can within the time limit. Press Space or Enter after each word.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => startGame(30)} className="flex-1" size="lg">
              30 Seconds
            </Button>
            <Button onClick={() => startGame(60)} className="flex-1" size="lg">
              60 Seconds
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active game
  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Stats bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-sm text-muted-foreground">Correct: </span>
            <span className="font-bold text-lg text-green-600 dark:text-green-400">{correctWords}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Wrong: </span>
            <span className="font-bold text-lg text-red-600 dark:text-red-400">{incorrectWords}</span>
          </div>
        </div>
        <div className="text-2xl font-mono font-bold text-foreground">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Current word display */}
      <div className="p-8 bg-muted/50 border rounded-xl text-center">
        <p className="text-4xl font-mono font-bold text-foreground tracking-wide">
          {currentWord}
        </p>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Type the word and press Space..."
        className="w-full p-4 text-xl font-mono text-center rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      <p className="text-center text-sm text-muted-foreground">
        Press Space or Enter after typing each word
      </p>
    </div>
  );
}
