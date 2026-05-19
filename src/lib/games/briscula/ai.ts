/**
 * Briscula CPU. Not a perfect player, but it follows the obvious
 * heuristics a casual human uses: conserve trumps and high cards when
 * leading, take valuable tricks cheaply, and never waste a strong card
 * on a worthless trick.
 */

import type { Card } from "../../cards/types";
import { cardPoints } from "../scoring";
import type { GameState } from "../types";
import { briscolaTrickWinner, cardStrength } from "./rules";

function isTrump(state: GameState, card: Card): boolean {
  return card.suit === state.trumpSuit;
}

/** Cheapest-to-lose ordering: low points first, then weak, non-trump. */
function disposalRank(state: GameState, card: Card): number {
  return (
    cardPoints(card) * 100 +
    cardStrength(card.rank) +
    (isTrump(state, card) ? 1000 : 0)
  );
}

export function chooseBriscolaCard(
  state: GameState,
  player: number,
): Card {
  const hand = state.hands[player];
  if (hand.length === 1) return hand[0];

  // Leading: dump the least valuable card, keeping trumps/aces/threes.
  if (state.table.length === 0) {
    return [...hand].sort(
      (a, b) => disposalRank(state, a) - disposalRank(state, b),
    )[0];
  }

  // Responding to the opponent's card.
  const opponent = state.table[0];
  const oppPoints = cardPoints(opponent.card);

  const winning = hand.filter(
    (c) =>
      briscolaTrickWinner(
        [opponent, { card: c, player }],
        state.trumpSuit,
      ) === player,
  );

  if (winning.length > 0) {
    const trickWorth = oppPoints; // points we'd capture from opponent
    const nonTrumpWins = winning.filter((c) => !isTrump(state, c));

    // Win with the cheapest non-trump that does the job.
    if (nonTrumpWins.length > 0) {
      return nonTrumpWins.sort(
        (a, b) =>
          cardPoints(a) - cardPoints(b) ||
          cardStrength(a.rank) - cardStrength(b.rank),
      )[0];
    }

    // Only burn a trump if the trick is actually worth it.
    if (trickWorth >= 10) {
      return winning.sort(
        (a, b) =>
          cardPoints(a) - cardPoints(b) ||
          cardStrength(a.rank) - cardStrength(b.rank),
      )[0];
    }
  }

  // Can't (or shouldn't) win: throw the least valuable card.
  return [...hand].sort(
    (a, b) => disposalRank(state, a) - disposalRank(state, b),
  )[0];
}
