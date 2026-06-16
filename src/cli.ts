#!/usr/bin/env node

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFile, readFile, access } from "node:fs/promises";
import { resolve } from "node:path";

const rl = createInterface({ input, output });

type Difficulty = "easy" | "medium" | "hard";

interface HighScore {
  attempts: number;
  timeSeconds: number;
  date: string;
}

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; chances: number }
> = {
  easy: { label: "Easy", chances: 10 },
  medium: { label: "Medium", chances: 5 },
  hard: { label: "Hard", chances: 3 },
};

const HIGH_SCORES_PATH = resolve(process.cwd(), ".highscores.json");

async function loadHighScores(): Promise<Record<Difficulty, HighScore | null>> {
  try {
    await access(HIGH_SCORES_PATH);
    const data = await readFile(HIGH_SCORES_PATH, "utf-8");
    const parsed = JSON.parse(data);
    return {
      easy: parsed.easy || null,
      medium: parsed.medium || null,
      hard: parsed.hard || null,
    };
  } catch {
    return { easy: null, medium: null, hard: null };
  }
}

async function saveHighScores(scores: Record<Difficulty, HighScore | null>) {
  await writeFile(HIGH_SCORES_PATH, JSON.stringify(scores, null, 2));
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

async function ask(question: string): Promise<string> {
  const answer = await rl.question(question);
  return answer.trim();
}

function printWelcome(): void {
  console.log("");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Welcome to the Number Guessing Game!");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");
  console.log("I'm thinking of a number between 1 and 100.");
  console.log("You have a limited number of chances to guess the correct number.");
  console.log("");
  console.log("Rules:");
  console.log("  - Select a difficulty level.");
  console.log("  - Enter a number between 1 and 100.");
  console.log('  - Type "hint" during a game for a clue (once per round).');
  console.log('  - Type "quit" at any prompt to exit.');
  console.log("");
}

async function selectDifficulty(): Promise<Difficulty> {
  console.log("Please select the difficulty level:");
  console.log("  1. Easy (10 chances)");
  console.log("  2. Medium (5 chances)");
  console.log("  3. Hard (3 chances)");

  while (true) {
    const choice = await ask("Enter your choice: ");

    if (choice.toLowerCase() === "quit") {
      console.log("Thanks for playing! Goodbye.");
      process.exit(0);
    }

    switch (choice) {
      case "1":
        return "easy";
      case "2":
        return "medium";
      case "3":
        return "hard";
      default:
        console.log("Invalid choice. Please enter 1, 2, or 3.");
    }
  }
}

async function playRound(highScores: Record<Difficulty, HighScore | null>): Promise<Record<Difficulty, HighScore | null>> {
  const difficulty = await selectDifficulty();
  const config = DIFFICULTY_CONFIG[difficulty];
  const target = Math.floor(Math.random() * 100) + 1;
  const maxChances = config.chances;

  console.log("");
  console.log(`Great! You have selected the ${config.label} difficulty level.`);
  console.log(`You have ${maxChances} chances to guess the correct number.`);
  console.log("Let's start the game!");
  console.log("");

  const startTime = Date.now();
  let attempts = 0;
  let hintUsed = false;

  while (attempts < maxChances) {
    const rawInput = await ask("Enter your guess: ");
    const normalized = rawInput.toLowerCase();

    if (normalized === "quit") {
      console.log("Thanks for playing! Goodbye.");
      await saveHighScores(highScores);
      process.exit(0);
    }

    if (normalized === "hint") {
      if (hintUsed) {
        console.log("You already used your hint this round.");
      } else if (attempts === 0) {
        console.log("Make at least one guess before asking for a hint.");
      } else {
        hintUsed = true;
        const range = Math.max(5, Math.min(20, 100 - attempts * 5));
        const lower = Math.max(1, target - range);
        const upper = Math.min(100, target + range);
        console.log(`HINT: The number is between ${lower} and ${upper}.`);
      }
      continue;
    }

    const guess = parseInt(rawInput, 10);
    if (Number.isNaN(guess) || guess < 1 || guess > 100) {
      console.log("Please enter a valid number between 1 and 100.");
      continue;
    }

    attempts++;

    if (guess === target) {
      const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
      console.log(`Congratulations! You guessed the correct number in ${attempts} attempts.`);
      console.log(`Time taken: ${formatTime(timeSeconds)}.`);

      const current = highScores[difficulty];
      let isNewHighScore = false;
      if (!current || attempts < current.attempts) {
        isNewHighScore = true;
      } else if (attempts === current.attempts && timeSeconds < current.timeSeconds) {
        isNewHighScore = true;
      }

      if (isNewHighScore) {
        highScores[difficulty] = {
          attempts,
          timeSeconds,
          date: new Date().toISOString(),
        };
        console.log(`🏆 New high score for ${config.label}: ${attempts} attempts!`);
      }

      return highScores;
    } else if (guess > target) {
      console.log(`Incorrect! The number is less than ${guess}.`);
    } else {
      console.log(`Incorrect! The number is greater than ${guess}.`);
    }
  }

  console.log(`Game over! The correct number was ${target}.`);
  return highScores;
}

async function askPlayAgain(): Promise<boolean> {
  while (true) {
    const answer = (await ask("Would you like to play again? (yes/no): ")).toLowerCase();
    if (answer === "yes" || answer === "y") return true;
    if (answer === "no" || answer === "n") return false;
    console.log('Please enter "yes" or "no".');
  }
}

function printHighScores(scores: Record<Difficulty, HighScore | null>): void {
  console.log("");
  console.log("High Scores (fewest attempts):");
  console.log("──────────────────────────────");
  for (const key of Object.keys(DIFFICULTY_CONFIG) as Difficulty[]) {
    const score = scores[key];
    const label = DIFFICULTY_CONFIG[key].label.padEnd(7);
    if (score) {
      console.log(`  ${label} ${score.attempts} attempts, ${formatTime(score.timeSeconds)}`);
    } else {
      console.log(`  ${label} No record yet`);
    }
  }
  console.log("");
}

async function main(): Promise<void> {
  printWelcome();
  let highScores = await loadHighScores();

  let playing = true;
  while (playing) {
    highScores = await playRound(highScores);
    await saveHighScores(highScores);
    printHighScores(highScores);
    playing = await askPlayAgain();
    if (playing) {
      console.log("");
      console.log("═══════════════════════════════════════════════════════════");
      console.log("  New Round");
      console.log("═══════════════════════════════════════════════════════════");
      console.log("");
    }
  }

  console.log("");
  console.log("Thanks for playing! Goodbye.");
  rl.close();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
