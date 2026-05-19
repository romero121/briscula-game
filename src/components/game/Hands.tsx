"use client";

import type { CSSProperties } from "react";

import type { Card } from "@/lib/cards/types";

import { CardBack } from "../cards/CardBack";
import { CardSprite } from "../cards/CardSprite";

const DEAL_STEP_MS = 120;

/**
 * Compute a card width that:
 *   - fits N cards in the container with the given gap,
 *   - never grows past `maxPx`,
 *   - never drops below `minPx` (the strip overflows scroll-x in the
 *     rare case the container truly cannot hold N touch-sized cards).
 */
function cardWidthCss(n: number, gap: number, minPx: number, maxPx: number) {
  const gaps = Math.max(0, n - 1) * gap;
  return `min(${maxPx}px, max(${minPx}px, calc((100% - ${gaps}px) / ${n})))`;
}

/** Opponent's hidden hand: a row of card backs. */
export function OpponentHand({
  count,
  dealing,
}: {
  count: number;
  dealing: boolean;
}) {
  const gap = 6;
  const w = cardWidthCss(Math.max(count, 1), gap, 32, 64);
  return (
    <div className="w-full overflow-x-auto pb-1">
      <div
        className="mx-auto flex w-full justify-center"
        style={{ gap, minWidth: "min-content" }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`shrink-0 ${dealing ? "animate-deal" : ""}`}
            style={{
              width: w,
              animationDelay: dealing ? `${i * 2 * DEAL_STEP_MS}ms` : undefined,
            }}
          >
            <CardBack />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The human's hand: large, touch-friendly, legal moves glow.
 * Always renders a single row (never wraps), so the bottom of the table
 * is never clipped. On very narrow screens the strip scrolls
 * horizontally instead of pushing content off-screen.
 */
export function PlayerHand({
  cards,
  legalIds,
  canPlay,
  dealing,
  onPlay,
}: {
  cards: Card[];
  legalIds: Set<string>;
  canPlay: boolean;
  dealing: boolean;
  onPlay: (cardId: string) => void;
}) {
  const gap = 8;
  const w = cardWidthCss(Math.max(cards.length, 1), gap, 56, 112);
  const rowStyle: CSSProperties = { gap, minWidth: "min-content" };
  return (
    <div className="w-full overflow-x-auto pb-1">
      <div
        className="mx-auto flex w-full items-end justify-center"
        style={rowStyle}
      >
        {cards.map((card, i) => {
          const legal = legalIds.has(card.id);
          const playable = canPlay && !dealing;
          return (
            <div
              key={card.id}
              className={`shrink-0 ${dealing ? "animate-deal" : ""}`}
              style={{
                width: w,
                animationDelay: dealing
                  ? `${(i * 2 + 1) * DEAL_STEP_MS}ms`
                  : undefined,
              }}
            >
              <CardSprite
                card={card}
                highlight={playable && legal}
                dimmed={playable && !legal}
                onClick={() => onPlay(card.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
