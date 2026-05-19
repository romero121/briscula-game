/**
 * Display sorting for a hand of cards. Pure, UI-agnostic, variant-aware.
 *
 * - Suits are grouped in a fixed table order: Denari → Coppe → Bastoni → Spade.
 * - Within each suit the strongest card (in that variant) sits leftmost,
 *   matching what feels natural when you fan a hand on a real table.
 *
 * The original array is never mutated.
 */

import { cardStrength as briscolaStrength } from "../games/briscula/rules";
import { cardStrength as tresettaStrength } from "../games/tresetta/rules";
import type { Suit } from "./types";
import type { Card } from "./types";

export const DISPLAY_SUIT_ORDER: readonly Suit[] = [
  "denari",
  "coppe",
  "bastoni",
  "spade",
];

export type SortVariant = "briscula" | "tresetta";

function strengthFor(variant: SortVariant) {
  return variant === "briscula" ? briscolaStrength : tresettaStrength;
}

/** Sorted as one flat array, in row order (suit-major). */
export function sortHandForDisplay(
  cards: readonly Card[],
  variant: SortVariant,
): Card[] {
  const strength = strengthFor(variant);
  const suitIndex = new Map(DISPLAY_SUIT_ORDER.map((s, i) => [s, i]));
  return [...cards].sort((a, b) => {
    const sa = suitIndex.get(a.suit) ?? DISPLAY_SUIT_ORDER.length;
    const sb = suitIndex.get(b.suit) ?? DISPLAY_SUIT_ORDER.length;
    if (sa !== sb) return sa - sb;
    // Higher game-strength first inside the suit.
    return strength(b.rank) - strength(a.rank);
  });
}

/**
 * Same sort, but returned grouped by suit in display order. Empty suits
 * are omitted so the renderer never has to draw a phantom group. The
 * group order is always a subset of DISPLAY_SUIT_ORDER.
 */
export function groupHandForDisplay(
  cards: readonly Card[],
  variant: SortVariant,
): { suit: Suit; cards: Card[] }[] {
  const sorted = sortHandForDisplay(cards, variant);
  const groups: { suit: Suit; cards: Card[] }[] = [];
  for (const card of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.suit === card.suit) last.cards.push(card);
    else groups.push({ suit: card.suit, cards: [card] });
  }
  return groups;
}
