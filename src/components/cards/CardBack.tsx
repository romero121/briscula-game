/**
 * Card back. The artwork sheet has no back design, so this is a styled
 * element — a deep-sea panel with a woven gold lattice, matching the
 * Mediterranean theme. Same aspect ratio as a real card.
 */
import type { CSSProperties } from "react";

import { cardAspectRatio } from "@/lib/cards/cardsConfig";

export function CardBack({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-label="Karta okrenuta naličjem"
      className={[
        "rounded-[7%] ring-1 ring-black/40",
        "shadow-[0_6px_14px_-4px_rgba(0,0,0,0.55)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        aspectRatio: String(cardAspectRatio()),
        background:
          "repeating-linear-gradient(45deg,#0b3a5b 0 8px,#0e4870 8px 16px)",
        boxShadow:
          "inset 0 0 0 2px rgba(217,180,106,0.55), inset 0 0 0 7px #06243b",
        ...style,
      }}
    >
      <div
        className="h-full w-full rounded-[7%]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(217,180,106,0.55) 1.5px, transparent 1.6px)",
          backgroundSize: "14px 14px",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}
