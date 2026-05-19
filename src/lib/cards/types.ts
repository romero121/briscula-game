/**
 * Core card domain types. UI-agnostic — no React here.
 *
 * Italian/Dalmatian 40-card deck ("carte triestine").
 * Suits: bastoni, coppe, denari, spade.
 * Ranks: asso(1), due(2), tre(3), quattro(4), cinque(5),
 *        sei(6), sette(7), fante(jack), cavallo(knight), re(king).
 */

export const SUITS = ["bastoni", "coppe", "denari", "spade"] as const;
export type Suit = (typeof SUITS)[number];

export const RANKS = [
  "asso",
  "due",
  "tre",
  "quattro",
  "cinque",
  "sei",
  "sette",
  "fante",
  "cavallo",
  "re",
] as const;
export type Rank = (typeof RANKS)[number];

export interface Card {
  suit: Suit;
  rank: Rank;
  /** Stable id, e.g. "denari-asso". Useful as React key and for equality. */
  id: string;
}

export function makeCard(suit: Suit, rank: Rank): Card {
  return { suit, rank, id: `${suit}-${rank}` };
}

export function cardsEqual(a: Card, b: Card): boolean {
  return a.suit === b.suit && a.rank === b.rank;
}

/** Human-readable Croatian/Dalmatian labels for the UI and dev panel. */
export const SUIT_LABELS: Record<Suit, string> = {
  bastoni: "Bastoni",
  coppe: "Coppe",
  denari: "Denari",
  spade: "Spade",
};

export const RANK_LABELS: Record<Rank, string> = {
  asso: "As",
  due: "2",
  tre: "Trica",
  quattro: "4",
  cinque: "5",
  sei: "6",
  sette: "7",
  fante: "Fanat",
  cavallo: "Konj",
  re: "Kralj",
};

export function cardLabel(card: Card): string {
  return `${RANK_LABELS[card.rank]} ${SUIT_LABELS[card.suit]}`;
}
