/**
 * SPRITESHEET CONFIGURATION — the ONLY place card-sheet geometry lives.
 *
 * The deck art is a single PNG containing all 40 cards in a regular grid.
 * Nothing else in the codebase hardcodes sheet pixels; everything reads
 * from here. If you swap the artwork or the grid changes, edit ONLY this
 * file.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ HOW TO ADAPT TO A DIFFERENT SHEET                             │
 * │ 1. Drop the PNG in /public/cards/ and set `src` below.        │
 * │ 2. Set `imageWidth` / `imageHeight` to the real pixel size.   │
 * │ 3. Set `columns` / `rows` to the grid layout.                 │
 * │ 4. Fix `suitRowOrder` (top→bottom) & `rankColumnOrder`        │
 * │    (left→right) so a (suit,rank) maps to the right cell.      │
 * │ Rendering uses percentage background-position, so it stays    │
 * │ pixel-perfect and responsive even if cells aren't integers.   │
 * └─────────────────────────────────────────────────────────────┘
 */

import type { Rank, Suit } from "./types";

export interface SpriteSheetConfig {
  /** Path under /public. */
  src: string;
  /** Intrinsic pixel size of the PNG. */
  imageWidth: number;
  imageHeight: number;
  /** Grid layout. */
  columns: number;
  rows: number;
  /** Suit per row, top → bottom. */
  suitRowOrder: Suit[];
  /** Rank per column, left → right. */
  rankColumnOrder: Rank[];
  /**
   * Optional path (under /public) to a traditional card-back image.
   * When set, `<CardBack>` renders this image instead of the muted CSS
   * fallback. Drop your back image into /public/cards/ and write the
   * path here — nothing else needs to change.
   */
  cardBackSrc?: string;
}

/**
 * Current artwork: `public/cards/Tršćanske_karte.png`
 * Verified layout from the printed sheet:
 *   - Rows (top→bottom): spade, coppe, denari, bastoni
 *   - Columns (left→right): asso, tre, re, cavallo, fante, 7, 6, 5, 4, 2
 *     (the two leftmost are the ornate Ace and the Three; the five
 *      rightmost are the plain pip cards 7,6,5,4,2)
 */
export const SPRITE_SHEET: SpriteSheetConfig = {
  src: "/cards/Tršćanske_karte.png",
  imageWidth: 811,
  imageHeight: 589,
  columns: 10,
  rows: 4,
  suitRowOrder: ["spade", "coppe", "denari", "bastoni"],
  rankColumnOrder: [
    "asso",
    "tre",
    "re",
    "cavallo",
    "fante",
    "sette",
    "sei",
    "cinque",
    "quattro",
    "due",
  ],
  // To use a traditional back image, drop it into /public/cards/ and
  // uncomment / edit the line below, e.g.:
  //   cardBackSrc: "/cards/card-back.png",
  cardBackSrc: undefined,
};

export interface SpriteCell {
  col: number;
  row: number;
}

/** (suit, rank) → grid cell. Throws if the config is inconsistent. */
export function getSpriteCell(
  suit: Suit,
  rank: Rank,
  sheet: SpriteSheetConfig = SPRITE_SHEET,
): SpriteCell {
  const row = sheet.suitRowOrder.indexOf(suit);
  const col = sheet.rankColumnOrder.indexOf(rank);
  if (row < 0) throw new Error(`Suit "${suit}" missing from suitRowOrder`);
  if (col < 0) throw new Error(`Rank "${rank}" missing from rankColumnOrder`);
  return { col, row };
}

/**
 * CSS values for rendering one card via a scaled background image.
 *
 * The element's own box is treated as one card. We blow the background up
 * to (columns × rows) times that box, then position by percentage so the
 * requested cell lands exactly in view. Percentages sidestep the fact that
 * 811/10 and 589/4 aren't integers, and stay correct at any rendered size.
 */
export function getSpriteStyle(
  suit: Suit,
  rank: Rank,
  sheet: SpriteSheetConfig = SPRITE_SHEET,
): {
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundRepeat: "no-repeat";
} {
  const { col, row } = getSpriteCell(suit, rank, sheet);
  const xPct = sheet.columns === 1 ? 0 : (col / (sheet.columns - 1)) * 100;
  const yPct = sheet.rows === 1 ? 0 : (row / (sheet.rows - 1)) * 100;
  return {
    backgroundImage: `url("${sheet.src}")`,
    backgroundSize: `${sheet.columns * 100}% ${sheet.rows * 100}%`,
    backgroundPosition: `${xPct}% ${yPct}%`,
    backgroundRepeat: "no-repeat",
  };
}

/** Single source of truth for card aspect ratio (width / height). */
export function cardAspectRatio(
  sheet: SpriteSheetConfig = SPRITE_SHEET,
): number {
  const cellW = sheet.imageWidth / sheet.columns;
  const cellH = sheet.imageHeight / sheet.rows;
  return cellW / cellH;
}
