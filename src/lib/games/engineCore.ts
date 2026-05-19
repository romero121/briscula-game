/**
 * Shared engine mechanics (turn flow, trick resolution, drawing, end of
 * game). Rule-specific decisions — legal moves, who wins a trick — are
 * delegated to each game's `GameRules`, so Briscula and Tresetta logic
 * stay in their own modules and are never mixed here.
 *
 * All functions are pure: they return a NEW state and never mutate input.
 */

import type { Card } from "../cards/types";
import { cardLabel, cardsEqual } from "../cards/types";
import { pilePoints } from "./scoring";
import type {
  CompletedTrick,
  GameRules,
  GameState,
  PlayedCard,
} from "./types";

function clone(state: GameState): GameState {
  return {
    ...state,
    players: [state.players[0], state.players[1]],
    hands: [state.hands[0].slice(), state.hands[1].slice()],
    stock: state.stock.slice(),
    table: state.table.map((p) => ({ ...p })),
    piles: [state.piles[0].slice(), state.piles[1].slice()],
    scores: [state.scores[0], state.scores[1]],
    log: state.log.slice(),
  };
}

function other(player: number): number {
  return player === 0 ? 1 : 0;
}

export interface EndGameOptions {
  /** Award 1 point for taking the final trick (traditional Tresetta). */
  lastTrickBonus?: boolean;
}

/**
 * Apply one card play for `player`. The caller is expected to have
 * validated legality via the rules; this re-checks defensively and throws
 * on an illegal move so bugs surface loudly in tests.
 */
export function applyMove(
  rules: GameRules,
  state: GameState,
  player: number,
  card: Card,
  endOpts: EndGameOptions = {},
): GameState {
  const legality = rules.validateMove(state, player, card);
  if (!legality.legal) {
    throw new Error(legality.reason ?? "Nelegalan potez.");
  }

  const next = clone(state);
  const handIdx = next.hands[player].findIndex((c) => cardsEqual(c, card));
  next.hands[player].splice(handIdx, 1);
  next.table.push({ card, player });
  next.log.push(`${next.players[player].name}: ${cardLabel(card)}`);

  // Trick still open — pass turn to the opponent.
  if (next.table.length < 2) {
    next.turn = other(player);
    return next;
  }

  // Trick complete: resolve it.
  const trick: PlayedCard[] = next.table;
  const winner = rules.trickWinner(next, trick);
  const wonCards = trick.map((t) => t.card);
  const points = pilePoints(wonCards);

  next.piles[winner].push(...wonCards);
  next.scores[winner] += points;
  const completed: CompletedTrick = { cards: trick, winner, points };
  next.lastTrick = completed;
  next.log.push(
    `Trik osvaja ${next.players[winner].name} (+${points}).`,
  );
  next.table = [];
  next.leader = winner;
  next.turn = winner;

  // Draw phase: winner draws first, then the opponent. Identical for
  // both games (Briscula stock of 34, two-handed Tresetta stock of 20).
  if (next.stock.length > 0) {
    const drawOrder = [winner, other(winner)];
    for (const p of drawOrder) {
      const drawn = next.stock.shift();
      if (drawn) next.hands[p].push(drawn);
    }
  }

  // Game over when no cards remain anywhere.
  const handsEmpty =
    next.hands[0].length === 0 && next.hands[1].length === 0;
  if (handsEmpty && next.stock.length === 0) {
    if (endOpts.lastTrickBonus) {
      next.scores[winner] += 1;
      next.log.push(
        `Zadnji trik: bonus +1 za ${next.players[winner].name}.`,
      );
    }
    next.phase = "finished";
    if (next.scores[0] > next.scores[1]) next.winner = 0;
    else if (next.scores[1] > next.scores[0]) next.winner = 1;
    else next.winner = "draw";
    const result =
      next.winner === "draw"
        ? "Neriješeno!"
        : `Pobjednik: ${next.players[next.winner].name}`;
    next.log.push(
      `Kraj partije — ${result} (${next.scores[0]} : ${next.scores[1]}).`,
    );
  }

  return next;
}
