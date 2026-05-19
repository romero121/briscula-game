"use client";

import { useState } from "react";

import { cardLabel } from "@/lib/cards/types";
import type { GameState } from "@/lib/games";

/**
 * Development-only inspector. Renders nothing in production builds
 * (Next.js statically replaces process.env.NODE_ENV, so this is
 * dead-code-eliminated outside `next dev`).
 */
export function DebugPanel({ state }: { state: GameState }) {
  const [open, setOpen] = useState(false);
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-3 right-3 z-50 max-w-[92vw] font-mono text-[11px]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded bg-black/70 px-3 py-1 text-gold ring-1 ring-gold/40"
      >
        {open ? "× DEV" : "⚙ DEV"}
      </button>
      {open && (
        <div className="mt-2 max-h-[60vh] w-80 overflow-auto rounded bg-black/85 p-3 text-cream/85 ring-1 ring-gold/30">
          <p className="text-gold">
            {state.variant} · phase={state.phase} · turn={state.turn} ·
            leader={state.leader}
          </p>
          <p className="mt-1">
            scores {state.scores[0]}:{state.scores[1]} · stock{" "}
            {state.stock.length} · trump {state.trumpSuit ?? "—"}
          </p>
          <p className="mt-2 text-gold">CPU ruka (otkriveno):</p>
          <ul>
            {state.hands[1].map((c) => (
              <li key={c.id}>· {cardLabel(c)}</li>
            ))}
          </ul>
          <p className="mt-2 text-gold">Log:</p>
          <ol className="space-y-0.5">
            {state.log.slice(-14).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
