"use client";

import type { GameState } from "@/lib/games";

import { CardSprite } from "../cards/CardSprite";

/**
 * The felt centre. While a trick is in progress it shows the live table;
 * during the post-trick freeze it shows the finished trick with the
 * winner's card highlighted.
 */
export function TrickArea({
  state,
  resolving,
}: {
  state: GameState;
  resolving: boolean;
}) {
  const showing =
    state.table.length > 0
      ? state.table
      : resolving && state.lastTrick
        ? state.lastTrick.cards
        : [];
  const winner =
    resolving && state.lastTrick ? state.lastTrick.winner : null;

  return (
    <div
      className="relative flex w-full flex-1 items-center justify-center rounded-3xl"
      style={{
        background:
          "radial-gradient(ellipse at center,var(--felt) 0%,var(--felt-edge) 100%)",
        boxShadow:
          "inset 0 0 60px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(217,180,106,0.3)",
        minHeight: "34vh",
      }}
    >
      {showing.length === 0 ? (
        <p className="px-6 text-center font-display text-lg text-cream/45">
          {state.players[state.turn]?.kind === "cpu"
            ? "Protivnik razmišlja…"
            : "Na potezu si — odigraj kartu"}
        </p>
      ) : (
        <div className="flex items-center gap-4 sm:gap-8">
          {showing.map((p) => (
            <div
              key={p.card.id}
              className="animate-play"
              style={{ width: "clamp(64px,17vw,128px)" }}
            >
              <CardSprite
                card={p.card}
                highlight={winner !== null && winner === p.player}
              />
              <p className="mt-1.5 text-center text-[11px] uppercase tracking-wider text-cream/55">
                {state.players[p.player].name}
              </p>
            </div>
          ))}
        </div>
      )}

      {winner !== null && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-sea-deep/80 px-4 py-1 text-xs text-gold animate-fade-up">
          Trik osvaja {state.players[winner].name}
          {state.lastTrick ? ` (+${state.lastTrick.points})` : ""}
        </div>
      )}
    </div>
  );
}
