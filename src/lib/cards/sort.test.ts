import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DISPLAY_SUIT_ORDER,
  groupHandForDisplay,
  sortHandForDisplay,
} from "./sort";
import { makeCard } from "./types";

test("input array is not mutated", () => {
  const hand = [makeCard("spade", "due"), makeCard("denari", "asso")];
  const snapshot = hand.map((c) => c.id);
  sortHandForDisplay(hand, "briscula");
  assert.deepEqual(
    hand.map((c) => c.id),
    snapshot,
  );
});

test("Briscula: suit order denari→coppe→bastoni→spade; strength desc inside suit", () => {
  const hand = [
    makeCard("spade", "due"),
    makeCard("denari", "sette"),
    makeCard("bastoni", "tre"),
    makeCard("denari", "asso"),
    makeCard("coppe", "re"),
    makeCard("denari", "due"),
    makeCard("bastoni", "asso"),
    makeCard("coppe", "fante"),
  ];
  const sorted = sortHandForDisplay(hand, "briscula");
  assert.deepEqual(
    sorted.map((c) => c.id),
    [
      // denari: asso, 7, 2 (briscola strength: asso > tre > re > cav > fante > 7 > 6 > 5 > 4 > 2)
      "denari-asso",
      "denari-sette",
      "denari-due",
      // coppe: re > fante
      "coppe-re",
      "coppe-fante",
      // bastoni: asso > tre
      "bastoni-asso",
      "bastoni-tre",
      // spade: due
      "spade-due",
    ],
  );
});

test("Tresetta strength order: tre > due > asso > re > cavallo > fante > 7..4", () => {
  const hand = [
    makeCard("coppe", "asso"),
    makeCard("coppe", "tre"),
    makeCard("coppe", "due"),
    makeCard("coppe", "re"),
    makeCard("coppe", "quattro"),
  ];
  const sorted = sortHandForDisplay(hand, "tresetta");
  assert.deepEqual(
    sorted.map((c) => c.rank),
    ["tre", "due", "asso", "re", "quattro"],
  );
});

test("group helper preserves order and omits empty suits", () => {
  const hand = [
    makeCard("bastoni", "asso"),
    makeCard("denari", "re"),
    makeCard("denari", "due"),
  ];
  const groups = groupHandForDisplay(hand, "briscula");
  assert.deepEqual(
    groups.map((g) => g.suit),
    ["denari", "bastoni"],
  );
  assert.deepEqual(groups[0].cards.map((c) => c.rank), ["re", "due"]);
  assert.deepEqual(groups[1].cards.map((c) => c.rank), ["asso"]);
});

test("display suit order is the documented constant", () => {
  assert.deepEqual(DISPLAY_SUIT_ORDER, [
    "denari",
    "coppe",
    "bastoni",
    "spade",
  ]);
});
