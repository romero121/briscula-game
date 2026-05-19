/**
 * Tresetta CPU. Respects the follow-suit obligation (it only ever picks
 * from the legal set), captures point cards when it cheaply can, and
 * avoids feeding big cards (Tre/Due/Asso) into worthless tricks.
 */

import type { Card } from "../../cards/types";
import { cardPoints } from "../scoring";
import type { GameState } from "../types";
import { cardStrength, tresettaRules, tresettaTrickWinner } from "./rules";

function byDisposalValue(a: Card, b: Card): number {
  return (
    cardPoints(a) - cardPoints(b) ||
    cardStrength(a.rank) - cardStrength(b.rank)
  );
}

export function chooseTresettaCard(
  state: GameState,
  player: number,
): Card {
  const legal = tresettaRules.legalMoves(state, player);
  if (legal.length === 1) return legal[0];

  // Leading: probe with the cheapest, weakest card; hold the big ones.
  if (state.table.length === 0) {
    return [...legal].sort(byDisposalValue)[0];
  }

  const opponent = state.table[0];
  const oppPoints = cardPoints(opponent.card);

  const winning = legal.filter(
    (c) => tresettaTrickWinner([opponent, { card: c, player }]) === player,
  );

  if (winning.length > 0) {
    const cheapestWin = [...winning].sort(byDisposalValue)[0];
    // Worth taking if the opponent committed points, or it can be won
    // without spending a scoring card of our own.
    if (oppPoints > 0 || cardPoints(cheapestWin) === 0) {
      return cheapestWin;
    }
  }

  // Not worth winning: shed the least valuable legal card.
  return [...legal].sort(byDisposalValue)[0];
}
