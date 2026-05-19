/**
 * Renders one card by cropping it out of the single spritesheet PNG.
 * All sheet geometry comes from cardsConfig — this component contains
 * zero magic numbers. Sizing is driven by the parent (fills width,
 * keeps the deck's aspect ratio), so it stays crisp and responsive.
 *
 * Visual style: subtle, like a real card in soft light. A faint dark
 * edge and a soft shadow — no gold outlines, no glow.
 */
import type { CSSProperties } from "react";

import {
  cardAspectRatio,
  getSpriteStyle,
} from "@/lib/cards/cardsConfig";
import { cardLabel, type Card } from "@/lib/cards/types";

export interface CardSpriteProps {
  card: Card;
  /** Legal-move hint — a soft lift, no neon. */
  highlight?: boolean;
  /** Greyed out (illegal / not playable now). */
  dimmed?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export function CardSprite({
  card,
  highlight = false,
  dimmed = false,
  onClick,
  className = "",
  style,
}: CardSpriteProps) {
  const interactive = typeof onClick === "function";
  const sprite = getSpriteStyle(card.suit, card.rank);

  return (
    <div
      role={interactive ? "button" : "img"}
      aria-label={cardLabel(card)}
      title={cardLabel(card)}
      tabIndex={interactive ? 0 : -1}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={[
        "relative select-none rounded-[6%] bg-[#f3ead4]",
        "ring-1 ring-black/35",
        "transition-transform duration-200 ease-out",
        interactive
          ? "cursor-pointer outline-none hover:-translate-y-2 focus-visible:-translate-y-2"
          : "",
        highlight ? "-translate-y-1" : "",
        dimmed ? "opacity-50 saturate-50" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        aspectRatio: String(cardAspectRatio()),
        boxShadow: highlight
          ? "0 10px 16px -8px rgba(0,0,0,0.55),0 0 0 1px rgba(40,28,10,0.45)"
          : "0 4px 9px -4px rgba(0,0,0,0.55)",
        ...sprite,
        ...style,
      }}
    />
  );
}
