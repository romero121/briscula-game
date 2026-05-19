/**
 * Tresetta (Tressette) rules. Self-contained — no Briscula logic here.
 *
 * No trump. Trick-taking strength within a suit, high → low:
 *   Tre, Due, Asso, Re, Cavallo, Fante, 7, 6, 5, 4.
 * Following the led suit is MANDATORY when you hold it.
 */

import type { Card, Rank, Suit } from "../../cards/types";
import { cardsEqual } from "../../cards/types";
import type {
  GameRules,
  GameState,
  MoveLegality,
  PlayedCard,
} from "../types";

/** Higher number = stronger card (Tre is the boss). */
const TRESETTA_STRENGTH: Record<Rank, number> = {
  tre: 10,
  due: 9,
  asso: 8,
  re: 7,
  cavallo: 6,
  fante: 5,
  sette: 4,
  sei: 3,
  cinque: 2,
  quattro: 1,
};

export function cardStrength(rank: Rank): number {
  return TRESETTA_STRENGTH[rank];
}

export const TRESETTA_HAND_SIZE = 10;

function ledSuit(state: GameState): Suit | undefined {
  return state.table[0]?.card.suit;
}

function hasSuit(hand: Card[], suit: Suit): boolean {
  return hand.some((c) => c.suit === suit);
}

/** Winner of a 2-card Tresetta trick. `trick[0]` led. */
export function tresettaTrickWinner(trick: PlayedCard[]): number {
  const [first, second] = trick;
  if (second.card.suit !== first.card.suit) {
    // Off-suit (responder was void in the led suit): cannot win.
    return first.player;
  }
  return cardStrength(second.card.rank) > cardStrength(first.card.rank)
    ? second.player
    : first.player;
}

export const tresettaRules: GameRules = {
  variant: "tresetta",
  handSize: TRESETTA_HAND_SIZE,

  legalMoves(state: GameState, player: number): Card[] {
    const hand = state.hands[player];
    const led = ledSuit(state);
    // Leader, or no led suit yet: anything goes.
    if (led === undefined) return hand.slice();
    // Must follow suit if able.
    if (hasSuit(hand, led)) return hand.filter((c) => c.suit === led);
    return hand.slice();
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
    const led = ledSuit(state);
    if (
      led !== undefined &&
      card.suit !== led &&
      hasSuit(state.hands[player], led)
    ) {
      return {
        legal: false,
        reason: `Moraš pratiti boju (${led}).`,
      };
    }
    return { legal: true };
  },

  trickWinner(_state: GameState, trick: PlayedCard[]): number {
    return tresettaTrickWinner(trick);
  },
};
