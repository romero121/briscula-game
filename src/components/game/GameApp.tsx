"use client";

import { useState } from "react";

import type { GameVariant } from "@/lib/games";

import { GameTable } from "./GameTable";
import { MainMenu } from "./MainMenu";

type Screen = { name: "menu" } | { name: "playing"; variant: GameVariant };

export function GameApp() {
  const [screen, setScreen] = useState<Screen>({ name: "menu" });
  // Bumping `round` changes GameTable's key → a clean remount and a
  // fresh deal, without any state-resetting effect.
  const [round, setRound] = useState(0);

  if (screen.name === "menu") {
    return (
      <MainMenu
        onSelect={(variant) => {
          setRound((r) => r + 1);
          setScreen({ name: "playing", variant });
        }}
      />
    );
  }

  return (
    <GameTable
      key={`${screen.variant}:${round}`}
      variant={screen.variant}
      onMenu={() => setScreen({ name: "menu" })}
      onNewGame={() => setRound((r) => r + 1)}
    />
  );
}
