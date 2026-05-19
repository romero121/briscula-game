/**
 * Renders one card by cropping it out of the single spritesheet PNG.
 * All sheet geometry comes from cardsConfig — this component contains
 * zero magic numbers. Sizing is driven by the parent (fills width,
 * keeps the deck's aspect ratio), so it stays crisp and responsive.
 */
import type { CSSProperties } from "react";

import {
  cardAspectRatio,
  getSpriteStyle,
} from "@/lib/cards/cardsConfig";
import { cardLabel, type Card } from "@/lib/cards/types";

export interface CardSpriteProps {
  card: Card;
  /** Legal-move glow. */
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
        "relative select-none rounded-[7%] bg-cream",
        "ring-1 ring-black/30 shadow-[0_6px_14px_-4px_rgba(0,0,0,0.55)]",
        "transition-transform transition-shadow duration-200",
        interactive
          ? "cursor-pointer hover:-translate-y-2 focus-visible:-translate-y-2 outline-none"
          : "",
        highlight
          ? "ring-2 ring-gold shadow-[0_0_0_3px_rgba(217,180,106,0.45),0_8px_18px_-4px_rgba(0,0,0,0.6)]"
          : "",
        dimmed ? "opacity-45 saturate-50" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        aspectRatio: String(cardAspectRatio()),
        ...sprite,
        ...style,
      }}
    />
  );
}
