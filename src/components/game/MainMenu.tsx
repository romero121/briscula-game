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
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-10">
      <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
        Dalmatinske karte · solo protiv računala
      </p>
      <h1 className="mt-3 text-center font-display text-5xl text-gold-gradient sm:text-6xl">
        Briscula &amp; Tresetta
      </h1>
      <p className="mt-3 max-w-md text-center text-cream/65">
        Tradicionalne talijansko-dalmatinske igre s 40 karata. Odaberi
        igru i započni partiju.
      </p>

      <div className="mt-10 grid w-full gap-5 sm:grid-cols-2">
        {GAMES.map((g) => (
          <button
            key={g.variant}
            onClick={() => onSelect(g.variant)}
            className="group flex flex-col rounded-2xl border border-gold/25 bg-sea-deep/55 p-6 text-left transition-all hover:-translate-y-1 hover:border-gold/60 hover:bg-sea-mid/70"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 shrink-0 drop-shadow-lg transition-transform group-hover:scale-105">
                <CardSprite card={g.art} />
              </div>
              <div>
                <h2 className="font-display text-3xl text-cream">
                  {g.title}
                </h2>
                <p className="text-sm text-gold/80">{g.tagline}</p>
              </div>
            </div>
            <ul className="mt-5 space-y-1.5 text-sm text-cream/70">
              {g.rules.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-gold">◆</span>
                  {r}
                </li>
              ))}
            </ul>
            <span className="mt-6 inline-block rounded-full bg-gold px-5 py-2 text-center text-sm font-semibold text-sea-deep transition-colors group-hover:bg-gold-bright">
              Igraj {g.title}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-cream/40">
        Online multiplayer dolazi kasnije — logika igre je već odvojena
        za to.
      </p>
    </div>
  );
}
