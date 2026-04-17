/**
 * SEO Page Data Generator
 *
 * Fetches live data from Aethar APIs and writes JSON data files
 * that Next.js uses at build time via generateStaticParams.
 *
 * Usage: AETHAR_API_KEY=xxx tsx scripts/generate-pages.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(__dirname, "..", "data", "generated");

const APIS = {
  salary: "https://salary.wageapi.com/api",
  eurostat: "https://eurostat.wageapi.com/api",
};

const API_KEY = process.env.AETHAR_API_KEY || "";
const headers: Record<string, string> = API_KEY ? { "X-API-Key": API_KEY } : {};

const EU_COUNTRIES = [
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "PL", name: "Poland" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
];

async function fetchApi(baseUrl: string, path: string) {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      headers,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

async function generateGdpPages() {
  console.log("Generating GDP pages...");
  const dir = join(DATA_DIR, "gdp");
  mkdirSync(dir, { recursive: true });

  for (const country of EU_COUNTRIES) {
    const data = await fetchApi(APIS.eurostat, `/v1/gdp?country=${country.code}&frequency=Q`);
    if (data) {
      writeFileSync(
        join(dir, `${country.code.toLowerCase()}.json`),
        JSON.stringify({ country, data, generatedAt: new Date().toISOString() }, null, 2),
      );
      console.log(`  GDP: ${country.name}`);
    }
  }
}

async function generateInflationPages() {
  console.log("Generating inflation pages...");
  const dir = join(DATA_DIR, "inflation");
  mkdirSync(dir, { recursive: true });

  for (const country of EU_COUNTRIES) {
    const data = await fetchApi(APIS.eurostat, `/v1/inflation?country=${country.code}&months=24`);
    if (data) {
      writeFileSync(
        join(dir, `${country.code.toLowerCase()}.json`),
        JSON.stringify({ country, data, generatedAt: new Date().toISOString() }, null, 2),
      );
      console.log(`  Inflation: ${country.name}`);
    }
  }
}

async function generateUnemploymentPages() {
  console.log("Generating unemployment pages...");
  const dir = join(DATA_DIR, "unemployment");
  mkdirSync(dir, { recursive: true });

  for (const country of EU_COUNTRIES) {
    const data = await fetchApi(APIS.eurostat, `/v1/unemployment?country=${country.code}`);
    if (data) {
      writeFileSync(
        join(dir, `${country.code.toLowerCase()}.json`),
        JSON.stringify({ country, data, generatedAt: new Date().toISOString() }, null, 2),
      );
      console.log(`  Unemployment: ${country.name}`);
    }
  }
}

async function generatePopulationPages() {
  console.log("Generating population pages...");
  const dir = join(DATA_DIR, "population");
  mkdirSync(dir, { recursive: true });

  for (const country of EU_COUNTRIES) {
    const data = await fetchApi(APIS.eurostat, `/v1/population?country=${country.code}`);
    if (data) {
      writeFileSync(
        join(dir, `${country.code.toLowerCase()}.json`),
        JSON.stringify({ country, data, generatedAt: new Date().toISOString() }, null, 2),
      );
      console.log(`  Population: ${country.name}`);
    }
  }
}

async function main() {
  mkdirSync(DATA_DIR, { recursive: true });
  console.log(`Generating SEO data pages → ${DATA_DIR}\n`);

  await generateGdpPages();
  await generateInflationPages();
  await generateUnemploymentPages();
  await generatePopulationPages();

  // Generate comparison pages from existing country data
  await generateComparisonPages();

  // Write manifest
  const manifest = {
    countries: EU_COUNTRIES,
    topics: ["gdp", "inflation", "unemployment", "population"],
    comparisons: COMPARISON_PAIRS.length,
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(DATA_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log("\nDone! Generated data for Next.js static build.");
}

// Top 13 country pairs by SEO value
const COMPARISON_PAIRS = [
  ["DE", "FR"], ["DE", "PL"], ["FR", "IT"], ["ES", "PT"],
  ["NL", "BE"], ["SE", "DK"], ["IT", "ES"], ["PL", "CZ"],
  ["AT", "DE"], ["NL", "DE"], ["FR", "ES"], ["IT", "DE"],
  ["FI", "SE"],
];

const TOPICS = ["gdp", "inflation", "unemployment", "population"];

async function generateComparisonPages() {
  console.log("Generating comparison pages...");
  const dir = join(DATA_DIR, "compare");

  let count = 0;
  for (const topic of TOPICS) {
    const topicDir = join(dir, topic);
    mkdirSync(topicDir, { recursive: true });

    for (const [c1, c2] of COMPARISON_PAIRS) {
      const file1 = join(DATA_DIR, topic, `${c1.toLowerCase()}.json`);
      const file2 = join(DATA_DIR, topic, `${c2.toLowerCase()}.json`);

      try {
        const data1 = JSON.parse(require("fs").readFileSync(file1, "utf-8"));
        const data2 = JSON.parse(require("fs").readFileSync(file2, "utf-8"));

        const slug = `${c1.toLowerCase()}-vs-${c2.toLowerCase()}`;
        writeFileSync(
          join(topicDir, `${slug}.json`),
          JSON.stringify({
            country1: data1,
            country2: data2,
            generatedAt: new Date().toISOString(),
          }, null, 2),
        );
        count++;
      } catch {
        // Skip pairs where data is missing
      }
    }
  }
  console.log(`  ${count} comparison pages generated`);
}

main().catch(console.error);
