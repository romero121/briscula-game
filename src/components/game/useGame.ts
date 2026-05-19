"use client";

/**
 * Bridges the pure engine to React: holds engine state, animates the
 * deal, schedules CPU turns, and freezes the table briefly after each
 * trick so the player can see what was won. No game rules live here —
 * only presentation timing.
 *
 * A fresh game is started by REMOUNTING this hook's component (the parent
 * changes its React `key`), so there is no state-resetting effect here.
 */
import { useCallback, useEffect, useRef, useState } from "react";

import {
  chooseCpuCard,
  createGame,
  legalMoves,
  playCard,
  validateMove,
  type GameState,
  type GameVariant,
} from "@/lib/games";

const HUMAN = 0;
const DEAL_MS_PER_CARD = 120;
const DEAL_TAIL_MS = 350;
const CPU_THINK_MS = 750;
const TRICK_PAUSE_MS = 1300;

export interface UseGame {
  state: GameState;
  variant: GameVariant;
  dealing: boolean;
  resolving: boolean;
  legalIds: Set<string>;
  humanCanPlay: boolean;
  notice: string | null;
  playHuman: (cardId: string) => void;
}

export function useGame(variant: GameVariant): UseGame {
  const [state, setState] = useState<GameState>(() => createGame(variant));
  const [dealing, setDealing] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const addTimer = useCallback((id: ReturnType<typeof setTimeout>) => {
    timers.current.push(id);
  }, []);

  // One-shot deal animation lock; cleared after the cards have flown in.
  useEffect(() => {
    const dealMs =
      state.players.length * state.hands[HUMAN].length * DEAL_MS_PER_CARD +
      DEAL_TAIL_MS;
    const id = setTimeout(() => setDealing(false), dealMs);
    return () => clearTimeout(id);
    // Runs once per mount; a new game remounts the component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const advance = useCallback(
    (player: number, cardId: string) => {
      setState((prev) => {
        if (prev.phase !== "playing" || prev.turn !== player) return prev;
        const card = prev.hands[player].find((c) => c.id === cardId);
        if (!card) return prev;
        const next = playCard(prev, player, card);
        const trickResolved =
          next.table.length === 0 && next.lastTrick !== prev.lastTrick;
        if (trickResolved) {
          setResolving(true);
          addTimer(setTimeout(() => setResolving(false), TRICK_PAUSE_MS));
        }
        return next;
      });
    },
    [addTimer],
  );

  // CPU turn driver. setState happens inside the timeout callback (not
  // synchronously in the effect body), so renders don't cascade.
  useEffect(() => {
    if (dealing || resolving) return;
    if (state.phase !== "playing") return;
    if (state.players[state.turn].kind !== "cpu") return;
    const cpu = state.turn;
    const id = setTimeout(() => {
      advance(cpu, chooseCpuCard(state, cpu).id);
    }, CPU_THINK_MS);
    return () => clearTimeout(id);
  }, [state, dealing, resolving, advance]);

  const humanCanPlay =
    !dealing &&
    !resolving &&
    state.phase === "playing" &&
    state.turn === HUMAN;

  const playHuman = useCallback(
    (cardId: string) => {
      if (!humanCanPlay) return;
      const card = state.hands[HUMAN].find((c) => c.id === cardId);
      if (!card) return;
      const check = validateMove(state, HUMAN, card);
      if (!check.legal) {
        setNotice(check.reason ?? "Nelegalan potez.");
        addTimer(setTimeout(() => setNotice(null), 2600));
        return;
      }
      setNotice(null);
      advance(HUMAN, cardId);
    },
    [humanCanPlay, state, advance, addTimer],
  );

  const legalIds = new Set(
    humanCanPlay ? legalMoves(state, HUMAN).map((c) => c.id) : [],
  );

  return {
    state,
    variant,
    dealing,
    resolving,
    legalIds,
    humanCanPlay,
    notice,
    playHuman,
  };
}
