/** Briscula game setup + move application. */

import { createShuffledDeck } from "../../cards/deck";
import type { Card } from "../../cards/types";
import { applyMove } from "../engineCore";
import type { GameState, Player } from "../types";
import { BRISCULA_HAND_SIZE, briscolaRules } from "./rules";

export interface BriscolaOptions {
  humanName?: string;
  cpuName?: string;
  /** Player index that leads the first trick (default 0 = human). */
  firstLeader?: number;
  /** Deterministic deck for tests. */
  rng?: () => number;
}

/**
 * Deal a fresh Briscula game.
 *
 * 40 cards → 3 to each player. The next card is the trump ("briscola");
 * we keep it as the LAST card of the stock so it is drawn last, exactly
 * as the face-up card placed under the deck in the physical game.
 */
export function createBriscolaGame(opts: BriscolaOptions = {}): GameState {
  const deck = createShuffledDeck(opts.rng);
  const players: [Player, Player] = [
    { index: 0, name: opts.humanName ?? "Ti", kind: "human" },
    { index: 1, name: opts.cpuName ?? "Računalo", kind: "cpu" },
  ];

  const hands: [Card[], Card[]] = [[], []];
  let cursor = 0;
  for (let r = 0; r < BRISCULA_HAND_SIZE; r++) {
    hands[0].push(deck[cursor++]);
    hands[1].push(deck[cursor++]);
  }

  const stock = deck.slice(cursor); // 34 cards; last one is the trump
  const trumpCard = stock[stock.length - 1];
  const leader = opts.firstLeader ?? 0;

  return {
    variant: "briscula",
    players,
    hands,
    stock,
    trumpSuit: trumpCard.suit,
    trumpCard,
    table: [],
    turn: leader,
    leader,
    piles: [[], []],
    scores: [0, 0],
    phase: "playing",
    log: [
      `Briscula — adut: ${trumpCard.suit}.`,
      `Prvi vuče: ${players[leader].name}.`,
    ],
  };
}

export function playBriscolaCard(
  state: GameState,
  player: number,
  card: Card,
): GameState {
  return applyMove(briscolaRules, state, player, card);
}
