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
      className="relative grid w-full gap-3 p-3 sm:p-4 lg:grid-cols-[1fr_19rem]"
      style={{ minHeight: "100svh", height: "100svh" }}
    >
      {/* MAIN: table felt with opponent hand on top, played cards in
          the middle (with the deck/trump pile pinned to the corner),
          and the player's hand pinned to the bottom. */}
      <main className="relative flex min-h-0 min-w-0 flex-col gap-2">
        <MobileStatusStrip
          variant={variant}
          state={state}
          notice={game.notice}
          onMenu={onMenu}
          onNewGame={onNewGame}
        />

        <OpponentHand count={state.hands[1].length} dealing={game.dealing} />

        <section
          className="relative min-h-[22vh] flex-1 overflow-hidden rounded-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center,var(--felt) 0%,var(--felt-edge) 100%)",
            boxShadow:
              "inset 0 0 60px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(217,180,106,0.3)",
          }}
        >
          <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
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
          legalIds={game.legalIds}
          canPlay={game.humanCanPlay}
          dealing={game.dealing}
          onPlay={game.playHuman}
        />
      </main>

      <aside className="hidden min-h-0 lg:block">
        <SidePanel
          state={state}
          notice={game.notice}
          onNewGame={onNewGame}
          onMenu={onMenu}
        />
      </aside>

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
 * Compact status strip shown on phones / tablets where the right-hand
 * SidePanel is hidden. Same critical info (variant, scores, turn, adut)
 * plus the table buttons, in a single horizontal bar.
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
        ? "Tvoj potez"
        : `${state.players[1].name}…`;

  return (
    <div className="lg:hidden flex items-center justify-between gap-2 rounded-xl border border-gold/25 bg-sea-deep/60 px-3 py-2 backdrop-blur-sm">
      <div className="flex items-center gap-3 min-w-0">
        <span className="truncate font-display text-base text-gold-gradient">
          {VARIANT_LABELS[variant]}
        </span>
        <span className="text-sm text-cream">
          <span className="text-gold-gradient font-display text-lg">
            {state.scores[0]}
          </span>
          <span className="mx-1 text-cream/40">:</span>
          <span className="font-display text-lg">{state.scores[1]}</span>
        </span>
        <span className="hidden text-[10px] uppercase tracking-wider text-cream/60 sm:inline">
          cilj {POINTS_TO_WIN + 1}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-sea-mid/60 px-2 py-0.5 text-[11px] text-cream/85">
          {notice ?? turn}
        </span>
        <button
          onClick={onNewGame}
          aria-label="Nova partija"
          className="rounded-full border border-gold/40 px-2 py-1 text-[11px] text-cream"
        >
          ↻
        </button>
        <button
          onClick={onMenu}
          aria-label="Glavni izbornik"
          className="rounded-full border border-gold/40 px-2 py-1 text-[11px] text-cream"
        >
          ☰
        </button>
      </div>
    </div>
  );
}
