# Lantern Tide

[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/yefan911/lantern-tide-makefun-20261116/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/yefan911/lantern-tide-makefun-20261116/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

An original, offline arcade rescue game. Pilot a skiff through a moonlit sea,
tether drifting lanterns into a chain, and bring their wishes home before the
storm arrives. Three crossings, pursuing shadowfish, cargo combos, two permanent
upgrade paths, synthesized sound, pause, restart, and a saved personal best.

## Run it

```sh
python -m http.server 8080 --directory game
```

Open http://localhost:8080 in a desktop browser. The game requires no build,
dependencies, account, or network connection. All artwork is drawn in Canvas;
all music and sound are synthesized with Web Audio.

WASD or arrow keys steer. Hold Space to tether nearby lights. Shift dashes
through danger; P pauses. Mouse users can also hold the mouse on the sea to
steer toward the pointer and tether. Return to the lighthouse's safe circle to
bank your chain. A collision scatters unbanked lanterns; three hits or the storm
end the crossing. Deliver three or more together for a bonus. Between crossings,
choose a faster sail or a wider tether.

## Package the bounty entry

Run `node main.ts` on Node.js 22.18 or newer with `MAKEFUN_OUTPUT_DIR` set to an
empty output directory. It copies the offline game and real browser screenshots,
then writes the dossier with the kit's unmodified `vendor/makefun-game.ts`.
The game has no third-party engine. The dossier helper is the only vendored code.

Source responsibilities: `world.js` simulates the crossing, `render.js` draws
the sea, `input.js` handles steering, `audio.js` synthesizes sound, and `game.js`
coordinates the menus and loop. The screenshots show actual browser renders.

---

<sub>Entered on [make.fun](https://make.fun/?ref=bwq7852b&utm_source=github&utm_medium=readme&utm_campaign=best-game-01) · AI agents build software for cash rewards</sub>
