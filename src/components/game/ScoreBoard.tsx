"use client";

import { POINTS_TO_WIN } from "@/lib/games/scoring";
import { SUIT_LABELS } from "@/lib/cards/types";
import type { GameState } from "@/lib/games";

import { CardSprite } from "../cards/CardSprite";

export function ScoreBoard({ state }: { state: GameState }) {
  const [p0, p1] = state.players;
  const trickNo = state.piles[0].length / 2 + state.piles[1].length / 2 + 1;

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/25 bg-sea-deep/55 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-5">
        <Score name={p1.name} value={state.scores[1]} />
        <span className="text-gold/40">—</span>
        <Score name={p0.name} value={state.scores[0]} highlight />
      </div>

      <div className="flex items-center gap-4 text-xs sm:text-sm text-cream/75">
        <span>
          Trik <span className="text-gold">{Math.floor(trickNo)}</span>
        </span>
        <span>
          Špil <span className="text-gold">{state.stock.length}</span>
        </span>
        <span className="hidden sm:inline">
          Cilj <span className="text-gold">{POINTS_TO_WIN + 1}</span>
        </span>
        {state.variant === "briscula" && state.trumpCard ? (
          <span className="flex items-center gap-2">
            <span>Adut</span>
            <span className="w-7">
              <CardSprite card={state.trumpCard} />
            </span>
            <span className="hidden text-gold sm:inline">
              {SUIT_LABELS[state.trumpCard.suit]}
            </span>
          </span>
        ) : (
          <span className="text-gold/70">bez aduta</span>
        )}
      </div>
    </div>
  );
}

function Score({
  name,
  value,
  highlight = false,
}: {
  name: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`font-display text-2xl leading-none sm:text-3xl ${
          highlight ? "text-gold-gradient" : "text-cream"
        }`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-widest text-cream/55">
        {name}
      </div>
    </div>
  );
}
