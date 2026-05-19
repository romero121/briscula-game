"use client";

import { makeCard } from "@/lib/cards/types";
import type { GameVariant } from "@/lib/games";

import { CardSprite } from "../cards/CardSprite";

const GAMES: {
  variant: GameVariant;
  title: string;
  tagline: string;
  rules: string[];
  art: ReturnType<typeof makeCard>;
}[] = [
  {
    variant: "briscula",
    title: "Briscula",
    tagline: "Igra s adutom — 3 karte u ruci",
    rules: [
      "Adut (briskula) tuče sve ostale boje",
      "Ne moraš pratiti boju",
      "Vučeš novu kartu nakon svakog trika",
    ],
    art: makeCard("denari", "asso"),
  },
  {
    variant: "tresetta",
    title: "Tresetta",
    tagline: "Bez aduta — obavezno praćenje boje",
    rules: [
      "Najjača: Trica, pa Dvica, pa As",
      "Moraš igrati boju koja je bačena",
      "Po 10 karata, dvoručna varijanta",
    ],
    art: makeCard("spade", "tre"),
  },
];

export function MainMenu({
  onSelect,
}: {
  onSelect: (variant: GameVariant) => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-10">
      <p className="text-[10px] uppercase tracking-[0.45em] text-gold-soft/75">
        Dalmatinske karte · protiv računala
      </p>
      <h1 className="mt-3 text-center font-display text-4xl text-gold-soft sm:text-5xl">
        Briscula &amp; Tresetta
      </h1>
      <p className="mt-3 max-w-md text-center text-sm text-cream/65">
        Tradicionalne talijansko-dalmatinske igre s 40 karata.
      </p>

      <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
        {GAMES.map((g) => (
          <button
            key={g.variant}
            onClick={() => onSelect(g.variant)}
            className="skin-overlay group flex flex-col rounded-lg p-5 text-left transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 shrink-0 transition-transform group-hover:scale-[1.04]">
                <CardSprite card={g.art} />
              </div>
              <div>
                <h2 className="font-display text-2xl text-cream">
                  {g.title}
                </h2>
                <p className="text-[12px] text-cream/65">{g.tagline}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-1 text-[12px] text-cream/65">
              {g.rules.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-gold-soft/70">·</span>
                  {r}
                </li>
              ))}
            </ul>
            <span className="mt-5 inline-block self-start rounded-full bg-gold/85 px-4 py-1.5 text-[12px] font-medium text-ink transition-colors group-hover:bg-gold-bright">
              Igraj {g.title}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-[11px] text-cream/35">
        Logika je spremna za online — multiplayer dolazi kasnije.
      </p>
    </div>
  );
}
