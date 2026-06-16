export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-6 text-slate-100">
      <div className="max-w-xl rounded-2xl border border-slate-700 bg-slate-800/80 p-8 shadow-2xl">
        <h1 className="mb-4 text-4xl font-extrabold text-white">
          Number Guessing Game
        </h1>
        <p className="mb-6 text-lg text-slate-300">
          This is a <strong>CLI-based</strong> game. Open your terminal and run
          the command below to play.
        </p>

        <div className="mb-6 rounded-xl bg-black p-4 font-mono text-sm text-green-400">
          npx tsx src/cli.ts
        </div>

        <h2 className="mb-3 text-xl font-semibold text-white">Features</h2>
        <ul className="mb-6 list-inside list-disc space-y-1 text-slate-300">
          <li>Random number between 1 and 100</li>
          <li>Difficulty levels: Easy (10), Medium (5), Hard (3)</li>
          <li>Higher/lower feedback after each guess</li>
          <li>Multiple rounds with play-again prompt</li>
          <li>Round timer</li>
          <li>Hint system (type "hint" during a round)</li>
          <li>Per-difficulty high score tracking</li>
        </ul>

        <p className="text-sm text-slate-400">
          High scores are saved to{" "}
          <code className="rounded bg-slate-700 px-1 py-0.5">.highscores.json</code>{" "}
          in the project root.
        </p>
      </div>
    </div>
  );
}
