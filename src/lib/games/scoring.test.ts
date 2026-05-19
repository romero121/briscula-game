import assert from "node:assert/strict";
import { test } from "node:test";

import { createDeck } from "../cards/deck";
import { makeCard } from "../cards/types";
import {
  CARD_POINTS,
  POINTS_TO_WIN,
  TOTAL_POINTS,
  cardPoints,
  pilePoints,
} from "./scoring";

test("point values match the spec", () => {
  assert.equal(CARD_POINTS.asso, 11);
  assert.equal(CARD_POINTS.tre, 10);
  assert.equal(CARD_POINTS.re, 4);
  assert.equal(CARD_POINTS.cavallo, 3);
  assert.equal(CARD_POINTS.fante, 2);
  for (const r of ["due", "quattro", "cinque", "sei", "sette"] as const) {
    assert.equal(CARD_POINTS[r], 0);
  }
});

test("the whole deck is worth exactly 120 points", () => {
  assert.equal(pilePoints(createDeck()), 120);
  assert.equal(TOTAL_POINTS, 120);
  assert.equal(POINTS_TO_WIN, 60);
});

test("cardPoints / pilePoints sum correctly", () => {
  assert.equal(cardPoints(makeCard("spade", "asso")), 11);
  assert.equal(
    pilePoints([
      makeCard("spade", "asso"),
      makeCard("coppe", "tre"),
      makeCard("denari", "due"),
    ]),
    21,
  );
});
