// Writes <name>-rest.svg: a figure's rest pose from its built hairline-<name>.html, as the static fallback.
// Usage: node export-fallback.mjs main-room
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url)), name = process.argv[2];
const { chromium } = createRequire(join(homedir(), "Library/Caches/hairline-look/look.cjs"))("playwright-core");
const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const page = await browser.newPage();
await page.goto(pathToFileURL(join(here, `hairline-${name}.html`)).href);
await page.waitForTimeout(1500);
const svg = await page.$eval("#stage > svg", (el) => { el.setAttribute("class", "hl"); return el.outerHTML.replace(/(\d+\.\d{2})\d+/g, "$1"); });
writeFileSync(join(here, `${name}-rest.svg`), svg + "\n");
console.log(name, svg.length);
await browser.close();
