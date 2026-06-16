# Number Guessing Game

A CLI-based number guessing game built with TypeScript and Node.js.

This project was created as a solution for the [Number Guessing Game](https://roadmap.sh/projects/number-guessing-game) project on [roadmap.sh](https://roadmap.sh).

## How to Play

The computer randomly selects a number between **1 and 100**. Your goal is to guess the number before you run out of chances.

1. Select a difficulty level:
   - **Easy** — 10 chances
   - **Medium** — 5 chances
   - **Hard** — 3 chances
2. Enter your guess in the terminal.
3. The game tells you whether the correct number is greater or less than your guess.
4. Guess correctly to win, or run out of chances to lose.
5. Choose to play again or quit after each round.

### Extra Commands

- `hint` — Get a clue about the correct number's range (once per round).
- `quit` — Exit the game at any time.

## Features

- Welcome message and rules
- Random number generation between 1 and 100
- Three difficulty levels
- Higher/lower feedback after each guess
- Multiple rounds with play-again prompt
- Round timer
- Hint system
- Per-difficulty high score tracking

## Sample Output

```text
═══════════════════════════════════════════════════════════
  Welcome to the Number Guessing Game!
═══════════════════════════════════════════════════════════

I'm thinking of a number between 1 and 100.
You have a limited number of chances to guess the correct number.

Please select the difficulty level:
  1. Easy (10 chances)
  2. Medium (5 chances)
  3. Hard (3 chances)
Enter your choice: 2

Great! You have selected the Medium difficulty level.
You have 5 chances to guess the correct number.
Let's start the game!

Enter your guess: 50
Incorrect! The number is less than 50.
Enter your guess: 25
Incorrect! The number is greater than 25.
Enter your guess: 35
Incorrect! The number is less than 35.
Enter your guess: 30
Congratulations! You guessed the correct number in 4 attempts.
Time taken: 0m 12s.
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/number-guessing-game.git
   cd number-guessing-game
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Game

Start the CLI game with:

```bash
npx tsx src/cli.ts
```

## Project Page

**Project URL:** https://roadmap.sh/projects/number-guessing-game

## Project Structure

```text
.
├── src/
│   ├── cli.ts          # Main CLI game
│   ├── App.tsx         # Web landing page
│   ├── main.tsx
│   └── index.css
├── .highscores.json    # Saved high scores (created after first game)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Technologies Used

- TypeScript
- Node.js
- tsx
- Vite
- Tailwind CSS

## License

This project is open source and available under the MIT License.
