"use client";

import { SUIT_LABELS } from "@/lib/cards/types";
import { VARIANT_LABELS, type GameState } from "@/lib/games";
import { POINTS_TO_WIN } from "@/lib/games/scoring";

import { CardSprite } from "../cards/CardSprite";

/**
 * Compact status overlay. Sits in a corner of the table — not a sidebar.
 * Warm, semi-transparent, small enough to leave the felt as the focus.
 * Mobile: stays just as compact (the layout pins it sensibly via the
 * GameTable wrapper, not by changing this component's design).
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
      ? "Kraj partije"
      : state.turn === 0
        ? "Tvoj potez"
        : `${cpu.name}…`;

  return (
    <div
      className="pointer-events-auto flex w-[200px] flex-col gap-2 rounded-xl px-3 py-2.5 text-cream backdrop-blur-md"
      style={{
        background:
          "linear-gradient(180deg, rgba(36,18,10,0.78) 0%, rgba(20,8,4,0.78) 100%)",
        boxShadow:
          "0 8px 20px -6px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(217,180,106,0.35), inset 0 0 0 3px rgba(60,30,12,0.55)",
      }}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-sm text-gold-gradient">
          {VARIANT_LABELS[state.variant]}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-cream/55">
          do {POINTS_TO_WIN + 1}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg bg-black/25 px-2 py-1.5 ring-1 ring-gold/15">
        <Score label={human.name} value={state.scores[0]} highlight />
        <span className="text-gold/40">:</span>
        <Score label={cpu.name} value={state.scores[1]} />
      </div>

      {state.variant === "briscula" ? (
        <div className="flex items-center gap-2 rounded-lg bg-black/20 px-2 py-1.5 ring-1 ring-gold/15">
          <div className="w-8 shrink-0">
            {state.trumpCard && <CardSprite card={state.trumpCard} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-widest text-cream/55">
              Adut
            </p>
            <p className="truncate font-display text-sm text-gold">
              {state.trumpCard ? SUIT_LABELS[state.trumpCard.suit] : "—"}
            </p>
          </div>
          <span className="text-[10px] text-cream/55">
            špil {state.stock.length}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg bg-black/20 px-2 py-1.5 text-[11px] text-cream/70 ring-1 ring-gold/15">
          <span>Bez aduta · prati boju</span>
          <span className="text-cream/55">špil {state.stock.length}</span>
        </div>
      )}

      <p className="text-center text-[11px] text-cream/85">
        <span className="text-cream/55">na potezu </span>
        <span className="font-medium">{turnText}</span>
      </p>

      {notice && (
        <p className="rounded-md bg-[color:var(--danger)]/85 px-2 py-1 text-center text-[11px] text-white animate-fade-up">
          {notice}
        </p>
      )}

      <div className="mt-0.5 flex gap-1.5">
        <button
          onClick={onNewGame}
          className="flex-1 rounded-full bg-gold/90 px-2 py-1 text-xs font-medium text-sea-deep transition-colors hover:bg-gold-bright"
        >
          ↻ Nova
        </button>
        <button
          onClick={onMenu}
          className="flex-1 rounded-full border border-gold/40 px-2 py-1 text-xs text-cream transition-colors hover:bg-black/30"
        >
          ☰ Meni
        </button>
      </div>
    </div>
  );
}

function Score({
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
        className={`font-display text-xl leading-none ${
          highlight ? "text-gold-gradient" : "text-cream"
        }`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[9px] uppercase tracking-widest text-cream/50">
        {label}
      </div>
    </div>
  );
}
