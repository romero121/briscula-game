/** Tresetta game setup + move application (two-handed variant). */

import { createShuffledDeck } from "../../cards/deck";
import type { Card } from "../../cards/types";
import { applyMove, type EndGameOptions } from "../engineCore";
import type { GameState, Player } from "../types";
import { TRESETTA_HAND_SIZE, tresettaRules } from "./rules";

export interface TresettaOptions {
  humanName?: string;
  cpuName?: string;
  firstLeader?: number;
  rng?: () => number;
  /**
   * Award +1 for the final trick. Off by default to match the project's
   * fixed scoring spec; flip on for traditional Tressette.
   */
  lastTrickBonus?: boolean;
}

/**
 * Two-handed Tresetta: 10 cards to each player, the remaining 20 form a
 * stock. After every trick the winner draws first, then the opponent,
 * until the stock is exhausted; the last 10 tricks are played from hand.
 * No trump.
 */
export function createTresettaGame(opts: TresettaOptions = {}): GameState {
  const deck = createShuffledDeck(opts.rng);
  const players: [Player, Player] = [
    { index: 0, name: opts.humanName ?? "Ti", kind: "human" },
    { index: 1, name: opts.cpuName ?? "Računalo", kind: "cpu" },
  ];

  const hands: [Card[], Card[]] = [[], []];
  let cursor = 0;
  for (let r = 0; r < TRESETTA_HAND_SIZE; r++) {
    hands[0].push(deck[cursor++]);
    hands[1].push(deck[cursor++]);
  }

  const stock = deck.slice(cursor); // 20 cards
  const leader = opts.firstLeader ?? 0;

  return {
    variant: "tresetta",
    players,
    hands,
    stock,
    table: [],
    turn: leader,
    leader,
    piles: [[], []],
    scores: [0, 0],
    phase: "playing",
    log: [
      "Tresetta — bez aduta, obavezno praćenje boje.",
      `Prvi vuče: ${players[leader].name}.`,
    ],
  };
}

export function playTresettaCard(
  state: GameState,
  player: number,
  card: Card,
  endOpts: EndGameOptions = {},
): GameState {
  return applyMove(tresettaRules, state, player, card, endOpts);
}
