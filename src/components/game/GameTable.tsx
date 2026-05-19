"use client";

import { VARIANT_LABELS, type GameVariant } from "@/lib/games";
import { POINTS_TO_WIN } from "@/lib/games/scoring";

import { DebugPanel } from "./DebugPanel";
import { DeckPile } from "./DeckPile";
import { GameOverScreen } from "./GameOverScreen";
import { OpponentHand, PlayerHand } from "./Hands";
import { SidePanel } from "./ScoreBoard";
import { TrickArea } from "./TrickArea";
import { useGame } from "./useGame";

export function GameTable({
  variant,
  onMenu,
  onNewGame,
}: {
  variant: GameVariant;
  onMenu: () => void;
  onNewGame: () => void;
}) {
  const game = useGame(variant);
  const { state } = game;
  const finished = state.phase === "finished" && !game.resolving;

  return (
    <div
      className="relative w-full p-2 sm:p-4"
      style={{ minHeight: "100svh", height: "100svh" }}
    >
      {/* Wooden table frame */}
      <div
        className="relative flex h-full w-full flex-col gap-2 rounded-[26px] p-2 sm:gap-3 sm:p-4"
        style={{
          background:
            "linear-gradient(135deg,#6a4424 0%,#3d2310 45%,#4a2c14 60%,#6a4424 100%)",
          boxShadow:
            "inset 0 0 0 2px rgba(232,200,140,0.28),inset 0 0 0 6px rgba(28,14,4,0.55),inset 0 0 38px rgba(0,0,0,0.55),0 30px 60px -22px rgba(0,0,0,0.85)",
        }}
      >
        {/* Small variant title in the top-left of the frame for context. */}
        <div className="pointer-events-none absolute left-4 top-3 z-20 hidden sm:block">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">
            {VARIANT_LABELS[variant]}
          </p>
        </div>

        {/* Compact status overlay — top-right of the table. */}
        <div className="pointer-events-none absolute right-2 top-2 z-20 hidden sm:block">
          <SidePanel
            state={state}
            notice={game.notice}
            onNewGame={onNewGame}
            onMenu={onMenu}
          />
        </div>

        {/* Mobile compact strip (replaces the corner overlay on phones). */}
        <MobileStatusStrip
          variant={variant}
          state={state}
          notice={game.notice}
          onMenu={onMenu}
          onNewGame={onNewGame}
        />

        {/* CPU hand, compact, top of felt. Right padding on sm+ leaves
            room for the corner status overlay. */}
        <div className="sm:pr-[212px]">
          <OpponentHand
            cards={state.hands[1]}
            variant={variant}
            dealing={game.dealing}
          />
        </div>

        {/* The felt: deck/trump pinned in the corner, played cards in
            the center. The felt is the visual centre of gravity. */}
        <section
          className="relative min-h-[22vh] flex-1 overflow-hidden rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 38%,#1a6a52 0%,#0e4a38 55%,#073525 100%)," +
              "repeating-radial-gradient(circle at 50% 50%,rgba(255,255,255,0.012) 0 2px,transparent 2px 7px)",
            boxShadow:
              "inset 0 0 0 1px rgba(217,180,106,0.32)," +
              "inset 0 0 0 4px rgba(20,8,4,0.55)," +
              "inset 0 0 90px rgba(0,0,0,0.55)",
          }}
        >
          <div className="absolute left-3 top-3 z-10 sm:left-5 sm:top-5">
            <DeckPile
              variant={variant}
              stockCount={state.stock.length}
              trumpCard={state.trumpCard}
            />
          </div>
          <TrickArea state={state} resolving={game.resolving} />
        </section>

        {/* Player hand, suit-grouped, slightly fanned. */}
        <PlayerHand
          cards={state.hands[0]}
          variant={variant}
          legalIds={game.legalIds}
          canPlay={game.humanCanPlay}
          dealing={game.dealing}
          onPlay={game.playHuman}
        />
      </div>

      {finished && (
        <GameOverScreen
          state={state}
          onNewGame={onNewGame}
          onMenu={onMenu}
        />
      )}

      <DebugPanel state={state} />
    </div>
  );
}

/**
 * Phone-sized status: scores + turn + tiny buttons in one strip.
 * Hidden at `sm` and up where the corner overlay takes over.
 */
function MobileStatusStrip({
  variant,
  state,
  notice,
  onMenu,
  onNewGame,
}: {
  variant: GameVariant;
  state: ReturnType<typeof useGame>["state"];
  notice: string | null;
  onMenu: () => void;
  onNewGame: () => void;
}) {
  const turn =
    state.phase === "finished"
      ? "Kraj"
      : state.turn === 0
        ? "Ti igraš"
        : `${state.players[1].name}…`;

  return (
    <div
      className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-cream sm:hidden"
      style={{
        background: "rgba(20,8,4,0.65)",
        boxShadow:
          "inset 0 0 0 1px rgba(217,180,106,0.3),inset 0 0 0 2px rgba(60,30,12,0.55)",
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="truncate font-display text-xs text-gold-gradient">
          {VARIANT_LABELS[variant]}
        </span>
        <span className="text-sm text-cream">
          <span className="text-gold-gradient font-display text-base">
            {state.scores[0]}
          </span>
          <span className="mx-1 text-cream/40">:</span>
          <span className="font-display text-base">{state.scores[1]}</span>
        </span>
        <span className="hidden text-[10px] uppercase tracking-wider text-cream/55 xs:inline">
          do {POINTS_TO_WIN + 1}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="truncate rounded-full bg-black/30 px-2 py-0.5 text-[11px] text-cream/85 ring-1 ring-gold/20">
          {notice ?? turn}
        </span>
        <button
          onClick={onNewGame}
          aria-label="Nova partija"
          className="rounded-full border border-gold/40 px-2 py-0.5 text-[11px] text-cream"
        >
          ↻
        </button>
        <button
          onClick={onMenu}
          aria-label="Glavni izbornik"
          className="rounded-full border border-gold/40 px-2 py-0.5 text-[11px] text-cream"
        >
          ☰
        </button>
      </div>
    </div>
  );
}
