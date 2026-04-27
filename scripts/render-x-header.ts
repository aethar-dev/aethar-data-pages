/**
 * Render scripts/x-header.svg to scripts/x-header.png at 1500x500 (X profile header size).
 *
 * Run: npx tsx scripts/render-x-header.ts
 *
 * The PNG is gitignored — re-render whenever you tweak the SVG. Upload the
 * resulting PNG as the @aethardev profile header image on x.com.
 */

import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const SVG_PATH = join(__dirname, "x-header.svg");
const PNG_PATH = join(__dirname, "x-header.png");

const svg = readFileSync(SVG_PATH, "utf-8");
const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1500 },
  background: "#0F1117",
});
const buffer = resvg.render().asPng();
writeFileSync(PNG_PATH, buffer);

const sizeKb = (buffer.byteLength / 1024).toFixed(1);
console.log(`Wrote ${PNG_PATH} (${sizeKb} KB, 1500x500)`);
