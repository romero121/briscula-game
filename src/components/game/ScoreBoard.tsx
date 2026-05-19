"use client";

import { SUIT_LABELS } from "@/lib/cards/types";
import { VARIANT_LABELS, type GameState } from "@/lib/games";
import { POINTS_TO_WIN } from "@/lib/games/scoring";

import { CardSprite } from "../cards/CardSprite";

/**
 * Compact status overlay. Lives in a corner of the table — small,
 * warm, semi-transparent, intentionally not a sidebar. The point is to
 * stay out of the way.
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
      className="skin-overlay pointer-events-auto flex w-[190px] flex-col gap-1.5 rounded-md px-2.5 py-2 text-cream"
      style={{ backdropFilter: "blur(6px)" as never }}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-[13px] text-gold-soft">
          {VARIANT_LABELS[state.variant]}
        </span>
        <span className="text-[9px] uppercase tracking-widest text-cream/55">
          do {POINTS_TO_WIN + 1}
        </span>
      </div>

      <div className="flex items-center justify-around px-1 py-0.5">
        <Score label={human.name} value={state.scores[0]} highlight />
        <span className="font-display text-base text-cream/35">:</span>
        <Score label={cpu.name} value={state.scores[1]} />
      </div>

      {state.variant === "briscula" ? (
        <div className="flex items-center gap-2 border-t border-gold/15 pt-1.5">
          <div className="w-7 shrink-0">
            {state.trumpCard && <CardSprite card={state.trumpCard} />}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[9px] uppercase tracking-widest text-cream/55">
              Adut
            </p>
            <p className="font-display text-[13px] text-gold-soft">
              {state.trumpCard ? SUIT_LABELS[state.trumpCard.suit] : "—"}
            </p>
          </div>
          <span className="text-[10px] text-cream/50">
            špil&nbsp;{state.stock.length}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between border-t border-gold/15 pt-1.5 text-[10px] text-cream/65">
          <span>Bez aduta</span>
          <span className="text-cream/50">špil {state.stock.length}</span>
        </div>
      )}

      <p className="text-center text-[11px] leading-tight text-cream/85">
        <span className="text-cream/50">na potezu</span>
        <br />
        <span className="font-medium">{turnText}</span>
      </p>

      {notice && (
        <p className="rounded bg-[color:var(--danger)]/80 px-2 py-1 text-center text-[10px] text-white animate-fade-up">
          {notice}
        </p>
      )}

      <div className="mt-0.5 flex gap-1.5">
        <button
          onClick={onNewGame}
          className="flex-1 rounded-full bg-gold/85 px-2 py-1 text-[11px] font-medium text-ink transition-colors hover:bg-gold-bright"
        >
          ↻ Nova
        </button>
        <button
          onClick={onMenu}
          className="flex-1 rounded-full border border-gold/35 px-2 py-1 text-[11px] text-cream transition-colors hover:bg-black/30"
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
    <div className="text-center leading-tight">
      <div
        className={`font-display text-[20px] ${
          highlight ? "text-gold-soft" : "text-cream"
        }`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[9px] uppercase tracking-widest text-cream/45">
        {label}
      </div>
    </div>
  );
}
