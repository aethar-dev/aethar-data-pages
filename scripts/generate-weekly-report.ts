/**
 * Weekly Report Generator
 *
 * Reads generated data JSONs and produces a Next.js page with analysis.
 * Run weekly via cron: npx tsx scripts/generate-weekly-report.ts
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(__dirname, "..", "data", "generated");
const REPORTS_DIR = join(__dirname, "..", "app", "reports");

interface CountryData {
  country: { code: string; name: string };
  data: Record<string, unknown>[];
  generatedAt: string;
}

function loadTopicData(topic: string): CountryData[] {
  const dir = join(DATA_DIR, topic);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith(".json"))
    .map(f => JSON.parse(readFileSync(join(dir, f), "utf-8")));
}

function getVal(d: Record<string, unknown>): number {
  return (d.value ?? d.rate ?? d.population ?? d.index_value ?? 0) as number;
}

function formatDate(): string {
  const d = new Date();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getWeekNumber(): number {
  const d = new Date();
  return Math.ceil(((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7);
}

function getWeekSlug(): string {
  const d = new Date();
  return `${d.getFullYear()}-w${String(getWeekNumber()).padStart(2, "0")}`;
}

function getWeekRange(): string {
  // Monday → Sunday range for the current ISO-ish week
  const d = new Date();
  const day = d.getUTCDay();
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const fmt = (x: Date) => x.toISOString().slice(0, 10);
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

function generateInsights() {
  const gdpData = loadTopicData("gdp");
  const inflationData = loadTopicData("inflation");
  const unemploymentData = loadTopicData("unemployment");
  const populationData = loadTopicData("population");

  // GDP: latest values ranked
  const gdpRanking = gdpData
    .map(c => {
      const latest = c.data[c.data.length - 1];
      return { name: c.country.name, code: c.country.code, value: latest ? getVal(latest as Record<string, unknown>) : 0 };
    })
    .sort((a, b) => b.value - a.value);

  // Inflation: latest values ranked
  const inflationRanking = inflationData
    .map(c => {
      const latest = c.data[c.data.length - 1];
      return { name: c.country.name, code: c.country.code, value: latest ? getVal(latest as Record<string, unknown>) : 0 };
    })
    .sort((a, b) => b.value - a.value);

  // Unemployment: latest rates
  const unemploymentRanking = unemploymentData
    .map(c => {
      const latest = c.data[c.data.length - 1];
      return { name: c.country.name, code: c.country.code, value: latest ? getVal(latest as Record<string, unknown>) : 0 };
    })
    .sort((a, b) => a.value - b.value);

  // Population: latest
  const populationRanking = populationData
    .map(c => {
      const latest = c.data[c.data.length - 1];
      return { name: c.country.name, code: c.country.code, value: latest ? getVal(latest as Record<string, unknown>) : 0 };
    })
    .sort((a, b) => b.value - a.value);

  return { gdpRanking, inflationRanking, unemploymentRanking, populationRanking };
}

function generatePage() {
  const weekSlug = getWeekSlug();
  const dateLabel = formatDate();
  const weekNumber = getWeekNumber();
  const weekRange = getWeekRange();
  const insights = generateInsights();

  const gdpRows = insights.gdpRanking.slice(0, 10).map(c =>
    `              <tr key="${c.code}" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">${c.name}</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">${c.value.toLocaleString()}</td>
              </tr>`
  ).join("\n");

  const inflationRows = insights.inflationRanking.slice(0, 10).map(c =>
    `              <tr key="${c.code}" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">${c.name}</td>
                <td className="py-2 text-right font-mono text-sm ${c.value > 125 ? 'text-red-400' : 'text-[#4DD0E1]'}">${c.value.toFixed(1)}</td>
              </tr>`
  ).join("\n");

  const unemploymentRows = insights.unemploymentRanking.slice(0, 10).map(c =>
    `              <tr key="${c.code}" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">${c.name}</td>
                <td className="py-2 text-right font-mono text-sm ${c.value > 7 ? 'text-red-400' : 'text-[#4DD0E1]'}">${c.value.toFixed(1)}%</td>
              </tr>`
  ).join("\n");

  const pageContent = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU Economic Weekly — Week ${weekNumber}, ${dateLabel}",
  description: "Week ${weekNumber} EU economic digest (${weekRange}): GDP rankings, inflation trends, unemployment rates across EU member states. Data from Eurostat via Aethar APIs.",
  alternates: { canonical: "/reports/weekly-${weekSlug}" },
};

export default function WeeklyReport() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#4DD0E1]">Weekly Data Report · Week ${weekNumber}</p>
      <h1 className="mt-2 text-2xl font-light text-white">EU Economic Weekly — Week ${weekNumber}, ${dateLabel}</h1>
      <p className="mt-3 text-sm text-[#8890AA]">${weekRange} · auto-generated from live Eurostat data via Aethar APIs.</p>

      {/* GDP */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">GDP — Top 10 Economies</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Quarterly GDP in millions EUR (latest available)</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">GDP (M EUR)</th></tr></thead>
          <tbody>
${gdpRows}
          </tbody>
        </table>
      </div>

      {/* Inflation */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Inflation (HICP Index)</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Latest harmonized index value (2015=100)</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">HICP Index</th></tr></thead>
          <tbody>
${inflationRows}
          </tbody>
        </table>
      </div>

      {/* Unemployment */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Unemployment — Lowest Rates</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Latest monthly unemployment rate</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">Rate</th></tr></thead>
          <tbody>
${unemploymentRows}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-lg border border-[#4DD0E1]/20 bg-[#4DD0E1]/5 p-8 text-center">
        <h2 className="text-lg font-light text-white">Get this data via API</h2>
        <p className="mt-2 text-sm text-[#8890AA]">All data in this report is available through EurostatAPI. Free tier: 100 req/day.</p>
        <a href="https://console.aethar.dev" className="mt-4 inline-block rounded bg-[#4DD0E1] px-6 py-2.5 text-sm font-semibold text-[#0F1117]">Get Free API Key</a>
      </div>

      <p className="mt-8 text-[10px] text-[#8890AA]">Data sourced from Eurostat via Aethar EurostatAPI. Auto-generated report.</p>
    </div>
  );
}
`;

  const dir = join(REPORTS_DIR, `weekly-${weekSlug}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "page.tsx"), pageContent);
  console.log(`Generated: /reports/weekly-${weekSlug}`);
  return weekSlug;
}

generatePage();
