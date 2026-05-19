"use client";

import { VARIANT_LABELS, type GameState } from "@/lib/games";

export function GameOverScreen({
  state,
  onNewGame,
  onMenu,
}: {
  state: GameState;
  onNewGame: () => void;
  onMenu: () => void;
}) {
  const youWon = state.winner === 0;
  const draw = state.winner === "draw";
  const title = draw
    ? "Neriješeno"
    : youWon
      ? "Pobijedio si!"
      : "Računalo je pobijedilo";

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-sea-deep/80 backdrop-blur-sm animate-fade-up">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-gold/35 bg-sea-mid/95 p-8 text-center shadow-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
          {VARIANT_LABELS[state.variant]} — kraj partije
        </p>
        <h2 className="mt-3 font-display text-4xl text-gold-gradient">
          {title}
        </h2>

        <div className="mt-6 flex items-center justify-center gap-6">
          <ScoreBlock label={state.players[0].name} value={state.scores[0]} />
          <span className="font-display text-2xl text-cream/40">:</span>
          <ScoreBlock label={state.players[1].name} value={state.scores[1]} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onNewGame}
            className="flex-1 rounded-full bg-gold px-6 py-3 font-semibold text-sea-deep transition-colors hover:bg-gold-bright"
          >
            Nova partija
          </button>
          <button
            onClick={onMenu}
            className="flex-1 rounded-full border border-gold/40 px-6 py-3 font-semibold text-cream transition-colors hover:bg-sea-light/40"
          >
            Glavni izbornik
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreBlock({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-display text-5xl text-cream">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-widest text-cream/55">
        {label}
      </div>
    </div>
  );
}
