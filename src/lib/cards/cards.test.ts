import assert from "node:assert/strict";
import { test } from "node:test";

import { getSpriteCell, SPRITE_SHEET } from "./cardsConfig";
import { createDeck, createRng, createShuffledDeck, shuffle } from "./deck";
import { cardsEqual, makeCard } from "./types";

test("deck has 40 unique cards", () => {
  const deck = createDeck();
  assert.equal(deck.length, 40);
  assert.equal(new Set(deck.map((c) => c.id)).size, 40);
});

test("shuffle is a permutation, non-mutating, reproducible by seed", () => {
  const deck = createDeck();
  const shuffled = shuffle(deck, createRng(123));
  assert.equal(shuffled.length, 40);
  assert.deepEqual(
    [...deck].map((c) => c.id).sort(),
    [...shuffled].map((c) => c.id).sort(),
  );
  assert.equal(deck[0].id, createDeck()[0].id, "original untouched");
  const a = createShuffledDeck(createRng(7)).map((c) => c.id);
  const b = createShuffledDeck(createRng(7)).map((c) => c.id);
  assert.deepEqual(a, b, "same seed → same order");
});

test("sprite mapping covers every card within the grid", () => {
  for (const card of createDeck()) {
    const { col, row } = getSpriteCell(card.suit, card.rank);
    assert.ok(col >= 0 && col < SPRITE_SHEET.columns);
    assert.ok(row >= 0 && row < SPRITE_SHEET.rows);
  }
  // The ornate Ace of Spade is the very first cell (col 0, row 0).
  assert.deepEqual(getSpriteCell("spade", "asso"), { col: 0, row: 0 });
});

test("card identity helpers", () => {
  assert.ok(cardsEqual(makeCard("denari", "re"), makeCard("denari", "re")));
  assert.ok(!cardsEqual(makeCard("denari", "re"), makeCard("spade", "re")));
});
