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
      {/* The table itself: weathered wood frame holding the felt. */}
      <div
        className="skin-wood relative flex h-full w-full flex-col gap-2 rounded-xl p-2 sm:gap-3 sm:rounded-2xl sm:p-4"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(200,167,102,0.18)," +
            "inset 0 0 0 5px rgba(20,11,4,0.6)," +
            "inset 0 0 60px rgba(0,0,0,0.55)," +
            "0 22px 50px -20px rgba(0,0,0,0.85)",
        }}
      >
        <div className="pointer-events-none absolute left-4 top-2 z-20 hidden sm:block">
          <p
            className="font-display text-[11px] uppercase tracking-[0.32em] text-gold-soft"
            style={{ opacity: 0.65 }}
          >
            {VARIANT_LABELS[variant]}
          </p>
        </div>

        {/* Small status overlay — top-right of the table. */}
        <div className="pointer-events-none absolute right-2 top-2 z-20 hidden sm:block">
          <SidePanel
            state={state}
            notice={game.notice}
            onNewGame={onNewGame}
            onMenu={onMenu}
          />
        </div>

        <MobileStatusStrip
          variant={variant}
          state={state}
          notice={game.notice}
          onMenu={onMenu}
          onNewGame={onNewGame}
        />

        {/* CPU hand. Right padding on sm+ leaves space for the overlay. */}
        <div className="sm:pr-[200px]">
          <OpponentHand
            cards={state.hands[1]}
            variant={variant}
            dealing={game.dealing}
          />
        </div>

        {/* Felt: deck + trump anchored top-left, played cards centred. */}
        <section
          className="skin-felt relative min-h-[22vh] flex-1 overflow-hidden rounded-lg sm:rounded-xl"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(0,0,0,0.45)," +
              "inset 0 0 0 6px rgba(20,11,4,0.45)," +
              "inset 0 0 70px rgba(0,0,0,0.55)",
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
 * Phone-sized status strip. Same data as the corner overlay, in one
 * compact horizontal bar. Hidden at `sm` and up.
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
    <div className="skin-overlay flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-cream sm:hidden">
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate font-display text-xs text-gold-soft">
          {VARIANT_LABELS[variant]}
        </span>
        <span className="text-sm">
          <span className="font-display text-base text-gold-soft">
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
        <span className="truncate rounded-full bg-black/30 px-2 py-0.5 text-[11px] text-cream/85">
          {notice ?? turn}
        </span>
        <button
          onClick={onNewGame}
          aria-label="Nova partija"
          className="rounded-full border border-gold/30 px-2 py-0.5 text-[11px] text-cream"
        >
          ↻
        </button>
        <button
          onClick={onMenu}
          aria-label="Glavni izbornik"
          className="rounded-full border border-gold/30 px-2 py-0.5 text-[11px] text-cream"
        >
          ☰
        </button>
      </div>
    </div>
  );
}
