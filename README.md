# Briscula & Tresetta

Web igra za **Briskulu** i **Trešetu** s tradicionalnim talijansko‑dalmatinskim
kartama (špil od 40 karata), lokalno protiv računala. Next.js 16 + React 19 +
TypeScript, bez suvišnih dependencyja.

## Pokretanje

```bash
npm install
npm run dev      # http://localhost:3000
```

Ostale skripte:

```bash
npm run build    # produkcijski build (Turbopack)
npm start        # produkcijski server
npm test         # unit testovi (Node ugrađeni test runner — nula dependencyja)
npm run lint     # ESLint
```

Zahtjevi: Node.js ≥ 20.9 (testovi koriste izvorno čitanje TypeScripta — Node 22+).

## Struktura

```
src/
  lib/
    cards/        types.ts · cardsConfig.ts · deck.ts   (domena karata)
    games/
      scoring.ts  engineCore.ts  types.ts  index.ts     (zajedničko + fasada)
      briscula/   rules.ts · engine.ts · ai.ts
      tresetta/   rules.ts · engine.ts · ai.ts
  components/
    cards/        CardSprite.tsx · CardBack.tsx
    game/         GameApp · MainMenu · GameTable · ScoreBoard · TrickArea
                  · Hands · GameOverScreen · DebugPanel · useGame
  app/            layout.tsx · page.tsx · globals.css
scripts/          ts-resolve.mjs · register-ts.mjs       (samo za testove)
```

Logika igre je potpuno odvojena od Reacta: sve u `src/lib/**` su čiste,
testabilne funkcije bez UI‑a. Pravila Briscule i Trešete su u zasebnim
modulima i nigdje se ne miješaju — `engineCore.ts` dijeli samo tijek poteza
(trik, vučenje, kraj) i delegira odluke o pravilima svakoj igri.

## Kako ubaciti / zamijeniti spritesheet

1. Stavi PNG sa svih 40 karata u `public/cards/`.
2. Otvori **`src/lib/cards/cardsConfig.ts`** — to je **jedino** mjesto s
   geometrijom špila. Postavi:
   - `src` — putanja ispod `/public` (trenutno
     `/cards/Tršćanske_karte.png`)
   - `imageWidth` / `imageHeight` — stvarne dimenzije PNG‑a u pikselima
     (trenutno **811 × 589**)
   - `columns` / `rows` — raspored mreže (trenutno **10 × 4**)
   - `suitRowOrder` — boja po redu, odozgo prema dolje
   - `rankColumnOrder` — rang po stupcu, slijeva nadesno

Renderiranje koristi postotni `background-position`, pa radi pikselno točno
i responzivno čak i kad ćelije nisu cijeli broj piksela — nije potrebno
ručno računati offsete.

### Gdje se podešavaju dimenzije karata na ekranu

Omjer karte (širina/visina) izvodi se automatski iz `cardsConfig.ts`
(`cardAspectRatio()`); nijedna komponenta ne hardkodira dimenzije.
Veličinu na ekranu kontroliraju roditeljski elementi preko CSS `clamp()`
(npr. `PlayerHand` u `src/components/game/Hands.tsx`) kako bi karte bile
dovoljno velike za dodir na mobitelu.

## Pravila (sažetak)

Zajedničko: špil od 40 (bastoni, coppe, denari, spade), bodovi
**As 11 · Trica 10 · Kralj 4 · Konj 3 · Fanat 2 · ostalo 0** (ukupno 120;
pobjeđuje > 60).

- **Briscula** — adut (briskula) tuče sve ostale boje, 3 karte u ruci,
  nema obveze praćenja boje, vučeš novu kartu nakon svakog trika.
  Jakost u boji: As > Trica > Kralj > Konj > Fanat > 7 > 6 > 5 > 4 > 2.
- **Tresetta** — bez aduta, **obavezno praćenje boje** ako je imaš;
  dvoručna varijanta (po 10 karata, špil 20, vuče se do iscrpljenja).
  Jakost u boji: Trica > Dvica > As > Kralj > Konj > Fanat > 7 > 6 > 5 > 4.
  Tradicionalni bod za zadnji trik je opcionalan
  (`lastTrickBonus`, isključeno prema specifikaciji).

Nelegalni potezi su blokirani i prikazuje se razlog (npr. „Moraš pratiti
boju”). CPU je heuristički — čuva adute/jake karte, jeftino uzima vrijedne
trikove, ne baca velike karte u bezvrijedne trikove.

## Dev panel

U `next dev` modu (`NODE_ENV=development`) dolje desno je gumb **⚙ DEV**:
otkriva CPU ruku, log poteza i interno stanje. Statički se uklanja iz
produkcijskog builda.

## Testovi

`npm test` pokreće ugrađeni Node test runner (`node:test`) nad `src/**/*.test.ts`
— **bez ijednog dodatnog dependencyja**. Pokriveno: bodovanje, izrada/miješanje
špila, mapping spritesheeta, legalni potezi (uklj. praćenje boje u Trešeti),
pobjednik trika za obje igre, te kraj partije (cijele AI‑vs‑AI partije s
provjerom invarijanti).

## Što je ostalo za online multiplayer

Logika je već spremna za to:

- `src/lib/games/**` su čiste funkcije; `applyMove` vraća novo stanje —
  idealno za autoritativni server (server pokreće engine, klijenti šalju
  poteze).
- `GameState` je serijabilan; treba transport (WebSocket) + soba/lobby.
- `useGame` raspoređuje CPU lokalno; u online verziji se zamjenjuje
  primanjem poteza protivnika preko mreže (sučelje `playCard`/`legalMoves`
  ostaje isto).
- Za dodati: autentikacija/identitet igrača, reconnect/replay iz `log`,
  validacija poteza na serveru (već postoji preko `validateMove`),
  4‑igračka 2v2 Tresetta varijanta.
