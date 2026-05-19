"use client";

import type { Card } from "@/lib/cards/types";

import { CardBack } from "../cards/CardBack";
import { CardSprite } from "../cards/CardSprite";

const DEAL_STEP_MS = 120;

/** Opponent's hidden hand: a fanned row of card backs. */
export function OpponentHand({
  count,
  dealing,
}: {
  count: number;
  dealing: boolean;
}) {
  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={dealing ? "animate-deal" : ""}
          style={{
            width: "clamp(46px,11vw,84px)",
            animationDelay: dealing ? `${i * 2 * DEAL_STEP_MS}ms` : undefined,
          }}
        >
          <CardBack />
        </div>
      ))}
    </div>
  );
}

/** The human's hand: large, touch-friendly, legal moves glow. */
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
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
      {cards.map((card, i) => {
        const legal = legalIds.has(card.id);
        const playable = canPlay && !dealing;
        return (
          <div
            key={card.id}
            className={dealing ? "animate-deal" : ""}
            style={{
              width: "clamp(64px,19vw,116px)",
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
  );
}
