// Core typing engine utilities

export interface TypingStats {
  totalCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
  accuracy: number;
  grossWPM: number;
  netWPM: number;
  timeElapsedSeconds: number;
  wrongWords: WrongWord[];
}

export interface WrongWord {
  expected: string;
  typed: string;
  position: number;
}

export interface CharacterComparison {
  char: string;
  status: 'correct' | 'incorrect' | 'pending' | 'current';
  index: number;
}

// Compare typed text against target text character by character
export function compareTexts(target: string, typed: string): CharacterComparison[] {
  const result: CharacterComparison[] = [];
  
  for (let i = 0; i < target.length; i++) {
    if (i < typed.length) {
      result.push({
        char: target[i],
        status: target[i] === typed[i] ? 'correct' : 'incorrect',
        index: i
      });
    } else if (i === typed.length) {
      result.push({
        char: target[i],
        status: 'current',
        index: i
      });
    } else {
      result.push({
        char: target[i],
        status: 'pending',
        index: i
      });
    }
  }
  
  return result;
}

// Calculate typing statistics
export function calculateStats(
  target: string,
  typed: string,
  timeElapsedSeconds: number
): TypingStats {
  let correctCharacters = 0;
  let incorrectCharacters = 0;
  
  const compareLength = Math.min(target.length, typed.length);
  
  for (let i = 0; i < compareLength; i++) {
    if (target[i] === typed[i]) {
      correctCharacters++;
    } else {
      incorrectCharacters++;
    }
  }
  
  // Count extra characters as errors
  if (typed.length > target.length) {
    incorrectCharacters += typed.length - target.length;
  }
  
  const totalCharacters = typed.length;
  
  // Word comparison
  const targetWords = target.split(/\s+/).filter(w => w.length > 0);
  const typedWords = typed.split(/\s+/).filter(w => w.length > 0);
  
  let correctWords = 0;
  let incorrectWords = 0;
  const wrongWords: WrongWord[] = [];
  
  const compareWordLength = Math.min(targetWords.length, typedWords.length);
  
  for (let i = 0; i < compareWordLength; i++) {
    if (targetWords[i] === typedWords[i]) {
      correctWords++;
    } else {
      incorrectWords++;
      wrongWords.push({
        expected: targetWords[i],
        typed: typedWords[i],
        position: i
      });
    }
  }
  
  // Count missing words as incorrect
  if (typedWords.length < targetWords.length) {
    incorrectWords += targetWords.length - typedWords.length;
  }
  
  const totalWords = typedWords.length;
  
  // Calculate accuracy (based on characters)
  const accuracy = totalCharacters > 0 
    ? Math.round((correctCharacters / totalCharacters) * 100) 
    : 0;
  
  // Calculate WPM (standard: 5 characters = 1 word)
  const timeInMinutes = timeElapsedSeconds / 60;
  const grossWPM = timeInMinutes > 0 
    ? Math.round((totalCharacters / 5) / timeInMinutes) 
    : 0;
  
  // Net WPM accounts for errors
  const netWPM = timeInMinutes > 0 
    ? Math.max(0, Math.round(((totalCharacters / 5) - incorrectCharacters) / timeInMinutes))
    : 0;
  
  return {
    totalCharacters,
    correctCharacters,
    incorrectCharacters,
    totalWords,
    correctWords,
    incorrectWords,
    accuracy,
    grossWPM,
    netWPM,
    timeElapsedSeconds,
    wrongWords
  };
}

// Get word indices that have errors
export function getWrongWordIndices(target: string, typed: string): Set<number> {
  const targetWords = target.split(/\s+/).filter(w => w.length > 0);
  const typedWords = typed.split(/\s+/).filter(w => w.length > 0);
  
  const wrongIndices = new Set<number>();
  
  for (let i = 0; i < targetWords.length; i++) {
    if (i < typedWords.length) {
      if (targetWords[i] !== typedWords[i]) {
        wrongIndices.add(i);
      }
    }
  }
  
  return wrongIndices;
}

// Format time as mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Generate random words for games
const simpleWords = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
  'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'boy',
  'did', 'own', 'say', 'she', 'too', 'use', 'cat', 'dog', 'run', 'big',
  'red', 'sun', 'fun', 'top', 'box', 'cup', 'hat', 'man', 'pen', 'bed'
];

export function getRandomWord(): string {
  return simpleWords[Math.floor(Math.random() * simpleWords.length)];
}

export function generateRandomWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(getRandomWord());
  }
  return words.join(' ');
}
