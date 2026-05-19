/**
 * Briscula (Briscola) rules. Self-contained — no Tresetta logic here.
 *
 * Trick-taking strength within a suit, high → low:
 *   Asso, Tre, Re, Cavallo, Fante, 7, 6, 5, 4, 2.
 * One suit is trump ("briscola") and beats any non-trump card.
 * No obligation to follow suit.
 */

import type { Card, Rank, Suit } from "../../cards/types";
import { cardsEqual } from "../../cards/types";
import type {
  GameRules,
  GameState,
  MoveLegality,
  PlayedCard,
} from "../types";

/** Higher number = stronger card. */
const BRISCULA_STRENGTH: Record<Rank, number> = {
  asso: 10,
  tre: 9,
  re: 8,
  cavallo: 7,
  fante: 6,
  sette: 5,
  sei: 4,
  cinque: 3,
  quattro: 2,
  due: 1,
};

export function cardStrength(rank: Rank): number {
  return BRISCULA_STRENGTH[rank];
}

export const BRISCULA_HAND_SIZE = 3;

function isTrump(card: Card, trumpSuit: Suit | undefined): boolean {
  return trumpSuit !== undefined && card.suit === trumpSuit;
}

/**
 * Winner of a 2-card Briscula trick. `trick[0]` led.
 * Returns the winning player's index.
 */
export function briscolaTrickWinner(
  trick: PlayedCard[],
  trumpSuit: Suit | undefined,
): number {
  const [first, second] = trick;
  const firstTrump = isTrump(first.card, trumpSuit);
  const secondTrump = isTrump(second.card, trumpSuit);

  if (firstTrump !== secondTrump) {
    return firstTrump ? first.player : second.player;
  }
  // Both trump, or neither trump.
  if (second.card.suit === first.card.suit) {
    return cardStrength(second.card.rank) > cardStrength(first.card.rank)
      ? second.player
      : first.player;
  }
  // Off-suit, non-trump second card cannot beat the led card.
  return first.player;
}

export const briscolaRules: GameRules = {
  variant: "briscula",
  handSize: BRISCULA_HAND_SIZE,

  // Briscula has no follow-suit obligation: every card in hand is legal.
  legalMoves(state: GameState, player: number): Card[] {
    return state.hands[player].slice();
  },

  validateMove(
    state: GameState,
    player: number,
    card: Card,
  ): MoveLegality {
    if (state.phase !== "playing") {
      return { legal: false, reason: "Partija je završena." };
    }
    if (state.turn !== player) {
      return { legal: false, reason: "Nije tvoj potez." };
    }
    if (!state.hands[player].some((c) => cardsEqual(c, card))) {
      return { legal: false, reason: "Ta karta nije u tvojoj ruci." };
    }
    return { legal: true };
  },

  trickWinner(state: GameState, trick: PlayedCard[]): number {
    return briscolaTrickWinner(trick, state.trumpSuit);
  },
};
