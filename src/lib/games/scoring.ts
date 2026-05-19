/**
 * Card point values. Per project spec these are shared by BOTH games:
 *   As = 11, Trica = 10, Kralj = 4, Konj = 3, Fanat = 2, rest = 0.
 * Total points in the deck = (11+10+4+3+2) * 4 = 120.
 *
 * Traditional Tressette scores in "terzi" (thirds) + a last-trick point;
 * that alternative lives behind `TRESETTA_TRADITIONAL_POINTS` so the
 * default stays faithful to the spec while remaining swappable.
 */

import type { Card, Rank } from "../cards/types";

export const CARD_POINTS: Record<Rank, number> = {
  asso: 11,
  tre: 10,
  re: 4,
  cavallo: 3,
  fante: 2,
  due: 0,
  quattro: 0,
  cinque: 0,
  sei: 0,
  sette: 0,
};

export const TOTAL_POINTS = 120;
/** Strictly more than this wins the game (60.5 → 61). */
export const POINTS_TO_WIN = TOTAL_POINTS / 2;

export function cardPoints(card: Card): number {
  return CARD_POINTS[card.rank];
}

export function pilePoints(cards: readonly Card[]): number {
  let total = 0;
  for (const c of cards) total += CARD_POINTS[c.rank];
  return total;
}
