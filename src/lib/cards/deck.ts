/** Deck construction and shuffling. Pure, UI-agnostic. */

import { RANKS, SUITS, makeCard, type Card } from "./types";

/** Fresh ordered 40-card deck. */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(makeCard(suit, rank));
    }
  }
  return deck;
}

/**
 * Deterministic PRNG (mulberry32) so games are reproducible/testable.
 * Returns a function yielding floats in [0, 1).
 */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle. Non-mutating; pass an rng for reproducibility. */
export function shuffle<T>(
  items: readonly T[],
  rng: () => number = Math.random,
): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Shuffled 40-card deck. */
export function createShuffledDeck(rng: () => number = Math.random): Card[] {
  return shuffle(createDeck(), rng);
}
