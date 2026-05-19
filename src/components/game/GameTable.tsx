"use client";

import { VARIANT_LABELS, type GameVariant } from "@/lib/games";

import { DebugPanel } from "./DebugPanel";
import { GameOverScreen } from "./GameOverScreen";
import { OpponentHand, PlayerHand } from "./Hands";
import { ScoreBoard } from "./ScoreBoard";
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
  const newGame = onNewGame;

  const finished = state.phase === "finished" && !game.resolving;

  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 px-3 py-4 sm:gap-4 sm:px-5">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-xl text-gold-gradient sm:text-2xl">
          {VARIANT_LABELS[variant]}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={newGame}
            className="rounded-full border border-gold/40 px-3 py-1.5 text-xs text-cream transition-colors hover:bg-sea-light/40 sm:text-sm"
          >
            Nova partija
          </button>
          <button
            onClick={onMenu}
            className="rounded-full border border-gold/40 px-3 py-1.5 text-xs text-cream transition-colors hover:bg-sea-light/40 sm:text-sm"
          >
            Izbornik
          </button>
        </div>
      </header>

      <ScoreBoard state={state} />

      <OpponentHand count={state.hands[1].length} dealing={game.dealing} />

      <TrickArea state={state} resolving={game.resolving} />

      <div className="min-h-[1.5rem] text-center">
        {game.notice && (
          <p className="inline-block rounded-full bg-[color:var(--danger)]/90 px-4 py-1 text-sm text-white animate-fade-up">
            {game.notice}
          </p>
        )}
      </div>

      <PlayerHand
        cards={state.hands[0]}
        legalIds={game.legalIds}
        canPlay={game.humanCanPlay}
        dealing={game.dealing}
        onPlay={game.playHuman}
      />

      {finished && (
        <GameOverScreen
          state={state}
          onNewGame={newGame}
          onMenu={onMenu}
        />
      )}

      <DebugPanel state={state} />
    </div>
  );
}
