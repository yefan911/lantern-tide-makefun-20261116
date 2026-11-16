import { cpSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// The submitted game is entirely offline. This entrypoint packages its actual
// browser captures with the exact, unmodified make.fun dossier library.
const repository = fileURLToPath(new URL('.', import.meta.url));
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const captures = readdirSync(join(repository, 'screenshots')).filter(name => /\.(jpe?g|png)$/i.test(name));
if (captures.length < 3 || captures.length > 4) throw new Error('Package 3 or 4 real browser screenshots before submitting.');
mkdirSync(output, { recursive: true });
for (const directory of ['game', 'screenshots']) {
  cpSync(join(repository, directory), join(output, directory), { recursive: true });
}
const dossier = buildDossier(output, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(output, 'dossier.json'), dossier);
console.log('Lantern Tide: offline game and browser screenshots packaged.');
