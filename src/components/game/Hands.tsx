"use client";

import type { CSSProperties } from "react";

import { groupHandForDisplay, sortHandForDisplay } from "@/lib/cards/sort";
import type { Card } from "@/lib/cards/types";
import type { GameVariant } from "@/lib/games";

import { CardBack } from "../cards/CardBack";
import { CardSprite } from "../cards/CardSprite";

const DEAL_STEP_MS = 110;

/**
 * Sizing for the human's hand. The player's row is the showcase, so
 * cards are wider; they overlap inside a suit (like a real fan) and a
 * small gap separates suit groups so the eye can parse the hand.
 */
const PLAYER = {
  cardW: "clamp(72px, 9.5vw, 116px)",
  overlapPct: 0.36, // 36 % of the card width is hidden under the next
  suitGap: "clamp(10px, 1.6vw, 22px)",
};

/** CPU hand: smaller backs, tighter overlap, no suit gap (all identical). */
const CPU = {
  cardW: "clamp(40px, 5.5vw, 64px)",
  overlapPct: 0.46,
};

/** Opponent's hidden hand: a compact overlapping row of card backs. */
export function OpponentHand({
  cards,
  variant,
  dealing,
}: {
  cards: Card[];
  variant: GameVariant;
  dealing: boolean;
}) {
  // Sorting is invisible (cards are face down) but kept consistent so
  // any internal animation indices line up with the player's order.
  const sorted = sortHandForDisplay(cards, variant);

  return (
    <div className="w-full overflow-x-auto">
      <div
        className="mx-auto flex w-fit items-start justify-center px-2"
        style={{ ["--card-w" as string]: CPU.cardW } as CSSProperties}
      >
        {sorted.map((card, i) => (
          <div
            key={card.id}
            className={`shrink-0 drop-shadow-md ${dealing ? "animate-deal" : ""}`}
            style={{
              width: "var(--card-w)",
              marginLeft: i === 0 ? 0 : `calc(var(--card-w) * -${CPU.overlapPct})`,
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
 * The human's hand: sorted by suit (Denari, Coppe, Bastoni, Spade) and
 * by game strength within each suit, with a slight overlap inside a
 * group and a small gap between groups so the hand reads like a real
 * fan on the table — not like UI tiles.
 */
export function PlayerHand({
  cards,
  variant,
  legalIds,
  canPlay,
  dealing,
  onPlay,
}: {
  cards: Card[];
  variant: GameVariant;
  legalIds: Set<string>;
  canPlay: boolean;
  dealing: boolean;
  onPlay: (cardId: string) => void;
}) {
  const groups = groupHandForDisplay(cards, variant);
  const handStyle = {
    ["--card-w" as string]: PLAYER.cardW,
    gap: PLAYER.suitGap,
  } as CSSProperties;

  // Continuous animation-delay index across all suit groups, so the
  // deal sweeps left-to-right regardless of grouping.
  let dealIdx = 0;

  return (
    <div className="w-full overflow-x-auto">
      <div
        className="mx-auto flex w-fit items-end justify-center px-2 pb-1"
        style={handStyle}
      >
        {groups.map((group) => (
          <div
            key={group.suit}
            className="flex items-end"
            aria-label={`${group.suit} (${group.cards.length})`}
          >
            {group.cards.map((card, i) => {
              const legal = legalIds.has(card.id);
              const playable = canPlay && !dealing;
              const myIdx = dealIdx++;
              return (
                <div
                  key={card.id}
                  className={`relative z-0 shrink-0 hover:z-20 focus-within:z-20 ${
                    dealing ? "animate-deal" : ""
                  }`}
                  style={{
                    width: "var(--card-w)",
                    marginLeft:
                      i === 0
                        ? 0
                        : `calc(var(--card-w) * -${PLAYER.overlapPct})`,
                    animationDelay: dealing
                      ? `${(myIdx * 2 + 1) * DEAL_STEP_MS}ms`
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
        ))}
      </div>
    </div>
  );
}
