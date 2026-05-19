/**
 * Variant-agnostic facade for the UI. The React layer talks only to this
 * module and never imports rule internals directly, so Briscula and
 * Tresetta stay cleanly separated behind one stable interface.
 */

import type { Card } from "../cards/types";
import { chooseBriscolaCard } from "./briscula/ai";
import { createBriscolaGame, playBriscolaCard } from "./briscula/engine";
import { briscolaRules } from "./briscula/rules";
import { chooseTresettaCard } from "./tresetta/ai";
import { createTresettaGame, playTresettaCard } from "./tresetta/engine";
import { tresettaRules } from "./tresetta/rules";
import type {
  GameRules,
  GameState,
  GameVariant,
  MoveLegality,
} from "./types";

export interface NewGameOptions {
  humanName?: string;
  cpuName?: string;
  firstLeader?: number;
  rng?: () => number;
}

export function createGame(
  variant: GameVariant,
  opts: NewGameOptions = {},
): GameState {
  return variant === "briscula"
    ? createBriscolaGame(opts)
    : createTresettaGame(opts);
}

export function playCard(
  state: GameState,
  player: number,
  card: Card,
): GameState {
  return state.variant === "briscula"
    ? playBriscolaCard(state, player, card)
    : playTresettaCard(state, player, card);
}

function rulesFor(state: GameState): GameRules {
  return state.variant === "briscula" ? briscolaRules : tresettaRules;
}

export function legalMoves(state: GameState, player: number): Card[] {
  return rulesFor(state).legalMoves(state, player);
}

export function validateMove(
  state: GameState,
  player: number,
  card: Card,
): MoveLegality {
  return rulesFor(state).validateMove(state, player, card);
}

export function chooseCpuCard(state: GameState, player: number): Card {
  return state.variant === "briscula"
    ? chooseBriscolaCard(state, player)
    : chooseTresettaCard(state, player);
}

export const VARIANT_LABELS: Record<GameVariant, string> = {
  briscula: "Briscula",
  tresetta: "Tresetta",
};

export type { GameState, GameVariant, MoveLegality } from "./types";
