import assert from "node:assert/strict";
import { test } from "node:test";

import { createRng } from "../../cards/deck";
import { makeCard } from "../../cards/types";
import type { GameState, PlayedCard } from "../types";
import { chooseTresettaCard } from "./ai";
import { createTresettaGame, playTresettaCard } from "./engine";
import { tresettaRules, tresettaTrickWinner } from "./rules";

const pc = (
  suit: Parameters<typeof makeCard>[0],
  rank: Parameters<typeof makeCard>[1],
  player: number,
): PlayedCard => ({ card: makeCard(suit, rank), player });

test("Tre is the strongest card; Due beats Asso", () => {
  assert.equal(
    tresettaTrickWinner([pc("coppe", "asso", 0), pc("coppe", "tre", 1)]),
    1,
  );
  assert.equal(
    tresettaTrickWinner([pc("coppe", "asso", 0), pc("coppe", "due", 1)]),
    1,
  );
  assert.equal(
    tresettaTrickWinner([pc("coppe", "due", 0), pc("coppe", "asso", 1)]),
    0,
  );
});

test("off-suit response cannot win (no trump in Tresetta)", () => {
  assert.equal(
    tresettaTrickWinner([pc("coppe", "quattro", 0), pc("denari", "tre", 1)]),
    0,
  );
});

test("must follow the led suit when able", () => {
  const base = createTresettaGame({ rng: createRng(9) });
  // Hand-craft a state: player 1 must follow coppe.
  const state: GameState = {
    ...base,
    hands: [
      [makeCard("coppe", "sette")],
      [makeCard("coppe", "due"), makeCard("denari", "asso")],
    ],
    table: [{ card: makeCard("coppe", "sette"), player: 0 }],
    turn: 1,
    leader: 0,
  };
  const legal = tresettaRules.legalMoves(state, 1);
  assert.deepEqual(
    legal.map((c) => c.id),
    ["coppe-due"],
    "only the coppe card is legal",
  );
  const bad = tresettaRules.validateMove(state, 1, makeCard("denari", "asso"));
  assert.equal(bad.legal, false);
  assert.match(bad.reason ?? "", /prati/i);
  assert.equal(
    tresettaRules.validateMove(state, 1, makeCard("coppe", "due")).legal,
    true,
  );
});

test("when void in the led suit, any card is legal", () => {
  const base = createTresettaGame({ rng: createRng(3) });
  const state: GameState = {
    ...base,
    hands: [[makeCard("coppe", "sette")], [makeCard("denari", "asso")]],
    table: [{ card: makeCard("coppe", "sette"), player: 0 }],
    turn: 1,
    leader: 0,
  };
  assert.equal(tresettaRules.legalMoves(state, 1).length, 1);
  assert.equal(
    tresettaRules.validateMove(state, 1, makeCard("denari", "asso")).legal,
    true,
  );
});

test("two-handed deal: 10+10, 20-card stock, no trump", () => {
  const g = createTresettaGame({ rng: createRng(11) });
  assert.equal(g.hands[0].length, 10);
  assert.equal(g.hands[1].length, 10);
  assert.equal(g.stock.length, 20);
  assert.equal(g.trumpSuit, undefined);
});

test("a full AI-vs-AI game finishes; CPU always plays a legal card", () => {
  let g = createTresettaGame({ rng: createRng(777) });
  let guard = 0;
  while (g.phase === "playing") {
    const p = g.turn;
    const choice = chooseTresettaCard(g, p);
    assert.equal(
      tresettaRules.validateMove(g, p, choice).legal,
      true,
      "AI must never pick an illegal card",
    );
    g = playTresettaCard(g, p, choice);
    assert.ok(guard++ < 200, "game must terminate");
  }
  assert.equal(g.scores[0] + g.scores[1], 120);
  assert.ok(g.winner === 0 || g.winner === 1 || g.winner === "draw");
});

test("last-trick bonus is opt-in and adds exactly one point", () => {
  const play = (bonus: boolean) => {
    let g = createTresettaGame({ rng: createRng(5), lastTrickBonus: bonus });
    while (g.phase === "playing") {
      const p = g.turn;
      g = playTresettaCard(g, p, chooseTresettaCard(g, p), {
        lastTrickBonus: bonus,
      });
    }
    return g.scores[0] + g.scores[1];
  };
  assert.equal(play(false), 120);
  assert.equal(play(true), 121);
});
