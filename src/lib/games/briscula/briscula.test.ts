import assert from "node:assert/strict";
import { test } from "node:test";

import { createRng } from "../../cards/deck";
import { makeCard } from "../../cards/types";
import type { PlayedCard } from "../types";
import { chooseBriscolaCard } from "./ai";
import { createBriscolaGame, playBriscolaCard } from "./engine";
import { briscolaTrickWinner, briscolaRules } from "./rules";

const pc = (suit: Parameters<typeof makeCard>[0], rank: Parameters<typeof makeCard>[1], player: number): PlayedCard => ({
  card: makeCard(suit, rank),
  player,
});

test("trump beats a higher off-suit card", () => {
  const trick = [pc("coppe", "asso", 0), pc("denari", "quattro", 1)];
  assert.equal(briscolaTrickWinner(trick, "denari"), 1);
});

test("higher card of led suit wins when no trump played", () => {
  const trick = [pc("coppe", "re", 0), pc("coppe", "asso", 1)];
  assert.equal(briscolaTrickWinner(trick, "denari"), 1);
  const trick2 = [pc("coppe", "asso", 0), pc("coppe", "tre", 1)];
  assert.equal(briscolaTrickWinner(trick2, "denari"), 0);
});

test("off-suit non-trump response cannot win", () => {
  const trick = [pc("coppe", "due", 0), pc("spade", "asso", 1)];
  assert.equal(briscolaTrickWinner(trick, "denari"), 0);
});

test("higher trump beats lower trump", () => {
  const trick = [pc("denari", "fante", 0), pc("denari", "tre", 1)];
  assert.equal(briscolaTrickWinner(trick, "denari"), 1);
});

test("initial deal: 3+3 cards, 34-card stock, trump set", () => {
  const g = createBriscolaGame({ rng: createRng(42) });
  assert.equal(g.hands[0].length, 3);
  assert.equal(g.hands[1].length, 3);
  assert.equal(g.stock.length, 34);
  assert.ok(g.trumpSuit);
  assert.equal(g.trumpCard?.suit, g.trumpSuit);
  assert.equal(g.trumpCard?.id, g.stock[g.stock.length - 1].id);
  // No follow-suit obligation: every held card is legal.
  assert.equal(briscolaRules.legalMoves(g, 0).length, 3);
});

test("illegal moves are rejected with a reason", () => {
  const g = createBriscolaGame({ rng: createRng(1) });
  const notInHand = g.stock[0];
  const r = briscolaRules.validateMove(g, 0, notInHand);
  assert.equal(r.legal, false);
  assert.match(r.reason ?? "", /ruci/);
  // Not your turn (CPU leads when firstLeader = 1).
  const g2 = createBriscolaGame({ rng: createRng(1), firstLeader: 1 });
  assert.equal(briscolaRules.validateMove(g2, 0, g2.hands[0][0]).legal, false);
});

test("a full AI-vs-AI game finishes with scores summing to 120", () => {
  let g = createBriscolaGame({ rng: createRng(2024) });
  let guard = 0;
  while (g.phase === "playing") {
    const p = g.turn;
    g = playBriscolaCard(g, p, chooseBriscolaCard(g, p));
    assert.ok(guard++ < 100, "game must terminate");
  }
  assert.equal(g.hands[0].length, 0);
  assert.equal(g.hands[1].length, 0);
  assert.equal(g.stock.length, 0);
  assert.equal(g.scores[0] + g.scores[1], 120);
  if (g.scores[0] > g.scores[1]) assert.equal(g.winner, 0);
  else if (g.scores[1] > g.scores[0]) assert.equal(g.winner, 1);
  else assert.equal(g.winner, "draw");
});
