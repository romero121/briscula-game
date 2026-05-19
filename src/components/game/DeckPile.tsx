"use client";

import type { CSSProperties } from "react";

import { cardAspectRatio } from "@/lib/cards/cardsConfig";
import type { Card } from "@/lib/cards/types";

import { CardBack } from "../cards/CardBack";
import { CardSprite } from "../cards/CardSprite";

/**
 * Deck stack with — for Briscula — the trump card laid face-up under it,
 * exactly like the briscola card placed sideways under the deck on a
 * real table. Hidden once the stock is exhausted and there is no trump
 * left to show.
 */
export function DeckPile({
  variant,
  stockCount,
  trumpCard,
}: {
  variant: "briscula" | "tresetta";
  stockCount: number;
  trumpCard?: Card;
}) {
  const showTrump = variant === "briscula" && !!trumpCard;
  // When the trump card is the only one left in stock, it is no longer
  // under the deck — the deck pile is empty, the trump sits exposed.
  const deckShows = stockCount > (showTrump ? 1 : 0);
  if (!deckShows && !showTrump) return null;

  const ar = cardAspectRatio();
  const cssVars = {
    "--card-w": "clamp(54px, 7vw, 78px)",
  } as CSSProperties;

  return (
    <div
      className="flex items-center gap-1"
      style={cssVars}
      aria-label={
        showTrump ? `Špil ${stockCount}, adut ${trumpCard.suit}` : `Špil ${stockCount}`
      }
    >
      {showTrump && (
        <div
          className="relative shrink-0"
          style={{
            width: `calc(var(--card-w) / ${ar})`,
            height: "var(--card-w)",
          }}
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: "var(--card-w)",
              transform: "translate(-50%,-50%) rotate(90deg)",
            }}
          >
            <CardSprite card={trumpCard} />
          </div>
        </div>
      )}

      {deckShows && (
        <div
          className="relative shrink-0 -ml-3"
          style={{
            width: "var(--card-w)",
            aspectRatio: String(ar),
          }}
        >
          <div className="absolute inset-0" style={{ transform: "translate(4px,-4px)" }}>
            <CardBack style={{ opacity: 0.55 }} />
          </div>
          <div className="absolute inset-0" style={{ transform: "translate(2px,-2px)" }}>
            <CardBack style={{ opacity: 0.8 }} />
          </div>
          <div className="absolute inset-0">
            <CardBack />
          </div>
          <span className="absolute -bottom-1 -right-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-gold ring-1 ring-gold/40">
            {stockCount}
          </span>
        </div>
      )}
    </div>
  );
}
