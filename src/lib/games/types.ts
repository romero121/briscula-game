/** Shared game-state types used by both Briscula and Tresetta engines. */

import type { Card } from "../cards/types";

export type GameVariant = "briscula" | "tresetta";

export type PlayerKind = "human" | "cpu";

export interface Player {
  /** 0 = bottom (human by default), 1 = top (cpu by default). */
  index: number;
  name: string;
  kind: PlayerKind;
}

export interface PlayedCard {
  card: Card;
  /** Player index that played it. */
  player: number;
}

export type GamePhase = "playing" | "finished";

/** Result of validating a candidate move. */
export interface MoveLegality {
  legal: boolean;
  /** Human-readable Croatian reason when illegal (shown in the UI). */
  reason?: string;
}

export interface CompletedTrick {
  cards: PlayedCard[];
  winner: number;
  /** Points collected in this trick. */
  points: number;
}

export interface GameState {
  variant: GameVariant;
  players: [Player, Player];
  /** Cards still in hand, indexed by player. */
  hands: [Card[], Card[]];
  /** Stock to draw from (Briscula). Empty/zero for the no-draw phase. */
  stock: Card[];
  /**
   * Briscula trump. The trump card sits at the bottom of the stock and is
   * the last card drawn; kept here for display and rule checks.
   */
  trumpSuit?: Card["suit"];
  trumpCard?: Card;
  /** Cards on the table for the trick in progress, in play order. */
  table: PlayedCard[];
  /** Player index to play next. */
  turn: number;
  /** Player index that led the current trick. */
  leader: number;
  /** Won-card piles, indexed by player (used for scoring). */
  piles: [Card[], Card[]];
  scores: [number, number];
  phase: GamePhase;
  /** Set when phase === "finished". */
  winner?: number | "draw";
  /** Most recently completed trick (for the table animation/log). */
  lastTrick?: CompletedTrick;
  /** Human-readable event log (newest last). */
  log: string[];
}

export interface GameRules {
  variant: GameVariant;
  /** Cards each player holds at full hand. */
  handSize: number;
  /** Legal moves for `player` given the current state. */
  legalMoves(state: GameState, player: number): Card[];
  /** Validate one move; returns a reason when illegal. */
  validateMove(state: GameState, player: number, card: Card): MoveLegality;
  /** Index (0/1) of the trick winner given the played cards. */
  trickWinner(state: GameState, trick: PlayedCard[]): number;
}
