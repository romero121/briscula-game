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
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 backdrop-blur-[2px] animate-fade-up">
      <div className="skin-overlay mx-4 w-full max-w-sm rounded-lg p-7 text-center">
        <p className="text-[10px] uppercase tracking-[0.32em] text-gold-soft/75">
          {VARIANT_LABELS[state.variant]} — kraj partije
        </p>
        <h2 className="mt-2 font-display text-3xl text-gold-soft sm:text-4xl">
          {title}
        </h2>

        <div className="mt-5 flex items-center justify-center gap-5">
          <ScoreBlock label={state.players[0].name} value={state.scores[0]} />
          <span className="font-display text-xl text-cream/30">:</span>
          <ScoreBlock label={state.players[1].name} value={state.scores[1]} />
        </div>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={onNewGame}
            className="flex-1 rounded-full bg-gold/90 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold-bright"
          >
            Nova partija
          </button>
          <button
            onClick={onMenu}
            className="flex-1 rounded-full border border-gold/35 px-5 py-2.5 text-sm text-cream transition-colors hover:bg-black/25"
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
      <div className="font-display text-4xl text-cream">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-cream/55">
        {label}
      </div>
    </div>
  );
}
