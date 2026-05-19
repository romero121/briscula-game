/**
 * Card back. If a traditional back image is configured (cardBackSrc in
 * cardsConfig.ts), it is rendered directly with only a soft shadow.
 * Otherwise we fall back to a quiet, muted CSS design — no gold border,
 * no neon, no gloss. The goal is "old card on a table", not "polished
 * UI tile".
 */
import type { CSSProperties } from "react";

import { SPRITE_SHEET, cardAspectRatio } from "@/lib/cards/cardsConfig";

export function CardBack({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const ar = String(cardAspectRatio());
  const shadow = "0 3px 7px -2px rgba(0,0,0,0.55)";

  if (SPRITE_SHEET.cardBackSrc) {
    return (
      <div
        aria-label="Karta okrenuta naličjem"
        className={`rounded-[6%] ${className}`}
        style={{
          aspectRatio: ar,
          backgroundImage: `url("${SPRITE_SHEET.cardBackSrc}")`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxShadow: shadow,
          ...style,
        }}
      />
    );
  }

  // Quiet fallback: deep wine red with a faint diagonal weave. Looks
  // close enough to an old worn back; can be swapped for the real image
  // by setting cardBackSrc in cardsConfig.
  return (
    <div
      aria-label="Karta okrenuta naličjem"
      className={`rounded-[6%] ${className}`}
      style={{
        aspectRatio: ar,
        background:
          "linear-gradient(180deg,#4a1414 0%,#2c0a0a 100%)," +
          "repeating-linear-gradient(45deg,rgba(0,0,0,0.12) 0 3px,transparent 3px 7px)",
        boxShadow: `${shadow}, inset 0 0 0 1px rgba(0,0,0,0.45)`,
        ...style,
      }}
    />
  );
}
