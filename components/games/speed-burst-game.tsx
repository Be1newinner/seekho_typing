"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRandomWord } from "@/lib/typing-utils";
import { Zap, Trophy } from "lucide-react";

const BURST_DURATION = 10; // 10 seconds per burst

interface BurstResult {
  wordsTyped: number;
  accuracy: number;
  wpm: number;
}

export function SpeedBurstGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds] = useState(3);
  const [timeLeft, setTimeLeft] = useState(BURST_DURATION);
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [wordsTyped, setWordsTyped] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [results, setResults] = useState<BurstResult[]>([]);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(3);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewWord = useCallback(() => {
    setCurrentWord(getRandomWord());
    setInput("");
  }, []);

  const startRound = useCallback(() => {
    setTimeLeft(BURST_DURATION);
    setWordsTyped(0);
    setCorrectWords(0);
    setIsResting(false);
    generateNewWord();
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [generateNewWord]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setCurrentRound(1);
    setResults([]);
    startRound();
  }, [startRound]);

  // Main game timer
  useEffect(() => {
    if (gameStarted && !gameOver && !isResting && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Round ended
            const roundAccuracy = wordsTyped > 0 
              ? Math.round((correctWords / wordsTyped) * 100) 
              : 0;
            const roundWPM = Math.round((correctWords / (BURST_DURATION / 60)));
            
            const newResult: BurstResult = {
              wordsTyped: correctWords,
              accuracy: roundAccuracy,
              wpm: roundWPM,
            };
            
            setResults((prev) => [...prev, newResult]);
            
            if (currentRound >= totalRounds) {
              setGameOver(true);
            } else {
              setIsResting(true);
              setRestTime(3);
            }
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
  }, [gameStarted, gameOver, isResting, timeLeft, wordsTyped, correctWords, currentRound, totalRounds]);

  // Rest timer between rounds
  useEffect(() => {
    if (isResting && restTime > 0) {
      const timer = setTimeout(() => {
        setRestTime((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isResting && restTime === 0) {
      setCurrentRound((prev) => prev + 1);
      startRound();
    }
  }, [isResting, restTime, startRound]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const trimmedInput = input.trim().toLowerCase();
      
      setWordsTyped((prev) => prev + 1);
      
      if (trimmedInput === currentWord.toLowerCase()) {
        setCorrectWords((prev) => prev + 1);
      }
      
      generateNewWord();
    }
  };

  // Calculate totals for results
  const totalWordsTyped = results.reduce((sum, r) => sum + r.wordsTyped, 0);
  const averageWPM = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / results.length)
    : 0;
  const averageAccuracy = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length)
    : 0;
  const bestWPM = results.length > 0 ? Math.max(...results.map(r => r.wpm)) : 0;

  // Resting between rounds
  if (isResting) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-16">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Round {currentRound} complete!</p>
            <p className="text-6xl font-bold text-primary animate-pulse">
              {restTime}
            </p>
            <p className="text-muted-foreground">Next round starting...</p>
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
          <div className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <CardTitle className="text-center text-2xl">Speed Burst Complete!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Round breakdown */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground text-center">Round Results</p>
            <div className="space-y-2">
              {results.map((result, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Round {i + 1}</span>
                  <div className="flex gap-4 text-sm">
                    <span>{result.wordsTyped} words</span>
                    <span className="font-bold text-primary">{result.wpm} WPM</span>
                    <span>{result.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Words</p>
              <p className="text-3xl font-bold text-foreground">{totalWordsTyped}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Best WPM</p>
              <p className="text-3xl font-bold text-yellow-500">{bestWPM}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Average WPM</p>
              <p className="text-3xl font-bold text-primary">{averageWPM}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Avg Accuracy</p>
              <p className="text-3xl font-bold text-foreground">{averageAccuracy}%</p>
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
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            <CardTitle className="text-center text-2xl">Speed Burst</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            3 rounds of 10-second typing bursts! Type as many words as you can in each burst. Your best round wins!
          </p>
          <div className="p-4 bg-muted/50 rounded-lg">
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>- 3 rounds, 10 seconds each</li>
              <li>- Short break between rounds</li>
              <li>- Press Space or Enter after each word</li>
              <li>- Try to beat your best WPM!</li>
            </ul>
          </div>
          <Button onClick={startGame} className="w-full" size="lg">
            Start Speed Burst
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
            <span className="text-sm text-muted-foreground">Round: </span>
            <span className="font-bold text-lg">{currentRound}/{totalRounds}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Words: </span>
            <span className="font-bold text-lg text-green-600 dark:text-green-400">{correctWords}</span>
          </div>
        </div>
        <div className={`text-3xl font-mono font-bold ${timeLeft <= 3 ? "text-red-500 animate-pulse" : "text-foreground"}`}>
          {timeLeft}s
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000"
          style={{ width: `${(timeLeft / BURST_DURATION) * 100}%` }}
        />
      </div>

      {/* Current word display */}
      <div className="p-8 bg-muted/50 border rounded-xl text-center">
        <p className="text-5xl font-mono font-bold text-foreground tracking-wide">
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
        placeholder="Type fast! Press Space..."
        className="w-full p-4 text-xl font-mono text-center rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      <p className="text-center text-sm text-muted-foreground">
        Press Space or Enter after typing each word. Go fast!
      </p>
    </div>
  );
}
