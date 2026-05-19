"use client";

import { SUIT_LABELS } from "@/lib/cards/types";
import { VARIANT_LABELS, type GameState } from "@/lib/games";
import { POINTS_TO_WIN } from "@/lib/games/scoring";

import { CardSprite } from "../cards/CardSprite";

/**
 * Right-hand status panel: variant, scores, trump (Briscula only),
 * whose turn it is, and the table-control buttons. On narrow viewports
 * the parent collapses this into a compact strip — same data, less
 * chrome, controlled by Tailwind classes from the GameTable wrapper.
 */
export function SidePanel({
  state,
  notice,
  onNewGame,
  onMenu,
}: {
  state: GameState;
  notice: string | null;
  onNewGame: () => void;
  onMenu: () => void;
}) {
  const [human, cpu] = state.players;
  const turnText =
    state.phase === "finished"
      ? "Partija završena"
      : state.turn === 0
        ? "Tvoj potez"
        : `${cpu.name} igra…`;

  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-2xl border border-gold/25 bg-sea-deep/55 p-4 backdrop-blur-sm">
      <div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-gold/70">
          Igra
        </p>
        <h2 className="mt-1 font-display text-2xl text-gold-gradient">
          {VARIANT_LABELS[state.variant]}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-sea-deep/60 p-3 ring-1 ring-gold/15">
        <ScoreBlock label={human.name} value={state.scores[0]} highlight />
        <ScoreBlock label={cpu.name} value={state.scores[1]} />
        <p className="col-span-2 mt-1 text-center text-[10px] uppercase tracking-widest text-cream/45">
          Cilj <span className="text-gold">{POINTS_TO_WIN + 1}</span> · Trik{" "}
          <span className="text-gold">
            {Math.floor(
              state.piles[0].length / 2 + state.piles[1].length / 2 + 1,
            )}
          </span>{" "}
          · Špil <span className="text-gold">{state.stock.length}</span>
        </p>
      </div>

      {state.variant === "briscula" ? (
        <div className="flex items-center gap-3 rounded-xl bg-sea-deep/60 p-3 ring-1 ring-gold/15">
          <div className="w-12 shrink-0">
            {state.trumpCard && <CardSprite card={state.trumpCard} />}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-cream/55">
              Adut
            </p>
            <p className="font-display text-lg text-gold">
              {state.trumpCard ? SUIT_LABELS[state.trumpCard.suit] : "—"}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-sea-deep/60 p-3 text-center text-sm text-cream/65 ring-1 ring-gold/15">
          Bez aduta · prati boju
        </div>
      )}

      <div className="rounded-xl bg-sea-mid/60 p-3 text-center text-sm ring-1 ring-gold/15">
        <p className="text-[10px] uppercase tracking-widest text-cream/55">
          Na potezu
        </p>
        <p className="mt-1 font-display text-base text-cream">{turnText}</p>
      </div>

      <div className="min-h-[2.25rem]">
        {notice && (
          <p className="rounded-lg bg-[color:var(--danger)]/90 px-3 py-1.5 text-center text-xs text-white animate-fade-up">
            {notice}
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={onNewGame}
          className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-sea-deep transition-colors hover:bg-gold-bright"
        >
          Nova partija
        </button>
        <button
          onClick={onMenu}
          className="rounded-full border border-gold/40 px-4 py-2 text-sm text-cream transition-colors hover:bg-sea-light/40"
        >
          Glavni izbornik
        </button>
      </div>
    </div>
  );
}

function ScoreBlock({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`font-display text-3xl leading-none ${
          highlight ? "text-gold-gradient" : "text-cream"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-cream/55">
        {label}
      </div>
    </div>
  );
}
