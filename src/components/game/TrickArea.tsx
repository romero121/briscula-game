"use client";

import type { CSSProperties } from "react";

import type { GameState } from "@/lib/games";

import { CardSprite } from "../cards/CardSprite";

/**
 * Played cards in the centre of the felt. While a trick is in progress
 * shows the live table; during the post-trick freeze shows the finished
 * trick with the winner's card highlighted.
 *
 * Pure presentation — no felt background, no deck. Those live on the
 * GameTable so this stays trivially reusable.
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

  const cssVars = {
    "--played-w": "clamp(72px, 11vw, 132px)",
  } as CSSProperties;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      style={cssVars}
    >
      {winner !== null && (
        <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-sea-deep/85 px-4 py-1 text-xs text-gold ring-1 ring-gold/40 animate-fade-up">
          Trik osvaja {state.players[winner].name}
          {state.lastTrick ? ` (+${state.lastTrick.points})` : ""}
        </div>
      )}
      {showing.length === 0 ? (
        <p className="px-6 text-center font-display text-base text-cream/45 sm:text-lg">
          {state.players[state.turn]?.kind === "cpu"
            ? "Protivnik razmišlja…"
            : "Na potezu si — odigraj kartu"}
        </p>
      ) : (
        <div className="flex items-center gap-3 sm:gap-6">
          {showing.map((p) => (
            <div
              key={p.card.id}
              className="animate-play"
              style={{ width: "var(--played-w)" }}
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
    </div>
  );
}
