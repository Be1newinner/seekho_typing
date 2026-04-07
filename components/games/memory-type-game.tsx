"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRandomWord } from "@/lib/typing-utils";
import { Eye, EyeOff, Brain } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";

const DISPLAY_TIMES: Record<Difficulty, number> = {
  easy: 3000,    // 3 seconds
  medium: 2000,  // 2 seconds
  hard: 1000,    // 1 second
};

const WORDS_PER_LEVEL: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export function MemoryTypeGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const displayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateWords = useCallback(() => {
    const wordCount = WORDS_PER_LEVEL[difficulty];
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(getRandomWord());
    }
    return words;
  }, [difficulty]);

  const showNextWords = useCallback(() => {
    const words = generateWords();
    setCurrentWords(words);
    setIsDisplaying(true);
    setInput("");

    displayTimeoutRef.current = setTimeout(() => {
      setIsDisplaying(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, DISPLAY_TIMES[difficulty]);
  }, [difficulty, generateWords]);

  const startGame = useCallback((selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLives(3);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setInput("");
    
    setTimeout(() => {
      showNextWords();
    }, 500);
  }, [showNextWords]);

  useEffect(() => {
    return () => {
      if (displayTimeoutRef.current) {
        clearTimeout(displayTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expectedAnswer = currentWords.join(" ").toLowerCase();
    const userAnswer = input.trim().toLowerCase();

    if (userAnswer === expectedAnswer) {
      // Correct answer
      const levelBonus = level * 5;
      setScore((prev) => prev + 10 + levelBonus);
      setCorrectAnswers((prev) => prev + 1);
      setLevel((prev) => prev + 1);
      showNextWords();
    } else {
      // Wrong answer
      setWrongAnswers((prev) => prev + 1);
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
        } else {
          showNextWords();
        }
        return newLives;
      });
    }
  };

  const accuracy = correctAnswers + wrongAnswers > 0
    ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100)
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
              <p className="text-sm text-muted-foreground">Level Reached</p>
              <p className="text-3xl font-bold text-primary">{level}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Correct</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{correctAnswers}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-3xl font-bold text-foreground">{accuracy}%</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button onClick={() => startGame("easy")} variant="outline" className="w-full">
              Easy (3s, 1 word)
            </Button>
            <Button onClick={() => startGame("medium")} className="w-full">
              Medium (2s, 2 words)
            </Button>
            <Button onClick={() => startGame("hard")} variant="secondary" className="w-full">
              Hard (1s, 3 words)
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
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle className="text-center text-2xl">Memory Type</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            A word will appear briefly. Memorize it, then type it after it disappears! Higher difficulties show more words for less time.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => startGame("easy")} variant="outline" className="w-full">
              Easy (3 seconds, 1 word)
            </Button>
            <Button onClick={() => startGame("medium")} className="w-full">
              Medium (2 seconds, 2 words)
            </Button>
            <Button onClick={() => startGame("hard")} variant="secondary" className="w-full">
              Hard (1 second, 3 words)
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
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Score: </span>
            <span className="font-bold text-lg">{score}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Level: </span>
            <span className="font-bold text-lg text-primary">{level}</span>
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

      {/* Word display area */}
      <div className="p-12 bg-muted/50 border rounded-xl text-center min-h-[200px] flex flex-col items-center justify-center">
        {isDisplaying ? (
          <>
            <Eye className="h-8 w-8 text-primary mb-4" />
            <p className="text-4xl font-mono font-bold text-foreground tracking-wide">
              {currentWords.join(" ")}
            </p>
            <p className="text-sm text-muted-foreground mt-4">Memorize this!</p>
          </>
        ) : (
          <>
            <EyeOff className="h-8 w-8 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">
              Type what you saw!
            </p>
          </>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isDisplaying ? "Wait..." : "Type the word(s) and press Enter..."}
          disabled={isDisplaying}
          className="w-full p-4 text-xl font-mono text-center rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:opacity-50"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <Button 
          type="submit" 
          className="w-full" 
          size="lg" 
          disabled={isDisplaying || input.trim().length === 0}
        >
          Submit Answer
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ({WORDS_PER_LEVEL[difficulty]} word{WORDS_PER_LEVEL[difficulty] > 1 ? "s" : ""}, {DISPLAY_TIMES[difficulty] / 1000}s)
      </p>
    </div>
  );
}
