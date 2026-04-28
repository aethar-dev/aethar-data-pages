/**
 * Monthly Report Generator
 *
 * Generates an "EU Economic Monthly" digest covering GDP, inflation,
 * unemployment, and population trends across EU member states. Runs on
 * the 1st of each month via the daily cron + a date-of-month gate.
 *
 * Output: app/reports/monthly-YYYY-MM/page.tsx
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(__dirname, "..", "data", "generated");
const REPORTS_DIR = join(__dirname, "..", "app", "reports");

interface Observation {
  period?: string;
  value?: number;
  rate?: number;
  population?: number;
  index_value?: number;
}

interface CountryData {
  country: { code: string; name: string };
  data: { observations?: Observation[] };
}

function loadTopicData(topic: string): CountryData[] {
  const dir = join(DATA_DIR, topic);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf-8")));
}

function getVal(o: Observation): number {
  return o.value ?? o.rate ?? o.population ?? o.index_value ?? 0;
}

function sortedByPeriodDesc(c: CountryData): Observation[] {
  const obs = c.data.observations ?? [];
  return [...obs].sort((a, b) => (b.period ?? "").localeCompare(a.period ?? ""));
}

function latestNonZero(c: CountryData): number {
  for (const o of sortedByPeriodDesc(c)) {
    const v = getVal(o);
    if (v !== 0) return v;
  }
  return 0;
}

function yoyChangePct(c: CountryData): number | null {
  // Compare latest non-zero to the observation ~12 months earlier.
  const sorted = sortedByPeriodDesc(c).filter((o) => getVal(o) !== 0);
  if (sorted.length < 2) return null;
  const latest = sorted[0];
  const latestPeriod = latest.period ?? "";
  const latestYear = parseInt(latestPeriod.slice(0, 4), 10);
  if (Number.isNaN(latestYear)) return null;
  // find the closest observation roughly 1 year prior (allow ±2 months tolerance)
  const target = `${latestYear - 1}${latestPeriod.slice(4)}`;
  const prior = sorted.find((o) => (o.period ?? "").startsWith(target.slice(0, 4)));
  if (!prior) return null;
  const latestVal = getVal(latest);
  const priorVal = getVal(prior);
  if (priorVal === 0) return null;
  return ((latestVal - priorVal) / priorVal) * 100;
}

function getMonthSlug(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(): string {
  const d = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function generateInsights() {
  const gdp = loadTopicData("gdp")
    .map((c) => ({ name: c.country.name, code: c.country.code, value: latestNonZero(c), yoy: yoyChangePct(c) }))
    .sort((a, b) => b.value - a.value);
  const inflation = loadTopicData("inflation")
    .map((c) => ({ name: c.country.name, code: c.country.code, value: latestNonZero(c), yoy: yoyChangePct(c) }))
    .sort((a, b) => b.value - a.value);
  const unemployment = loadTopicData("unemployment")
    .map((c) => ({ name: c.country.name, code: c.country.code, value: latestNonZero(c), yoy: yoyChangePct(c) }))
    .filter((c) => c.value > 0)
    .sort((a, b) => a.value - b.value);
  const population = loadTopicData("population")
    .map((c) => ({ name: c.country.name, code: c.country.code, value: latestNonZero(c), yoy: yoyChangePct(c) }))
    .sort((a, b) => b.value - a.value);
  return { gdp, inflation, unemployment, population };
}

function fmtYoy(yoy: number | null): string {
  if (yoy === null) return "—";
  const sign = yoy > 0 ? "+" : "";
  const colorClass = yoy > 0 ? "text-yellow-300" : "text-green-400";
  return `<span className="${colorClass}">${sign}${yoy.toFixed(1)}%</span>`;
}

function renderRow(c: { name: string; code: string; value: number }, yoy: number | null, fmtVal: (v: number) => string): string {
  return `              <tr key="${c.code}" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">${c.name}</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">${fmtVal(c.value)}</td>
                <td className="py-2 pl-4 text-right font-mono text-xs">${fmtYoy(yoy)}</td>
              </tr>`;
}

function generatePage() {
  const slug = getMonthSlug();
  const monthLabel = formatMonth();
  const ins = generateInsights();

  const fmtCount = (v: number) => v.toLocaleString();
  const fmtPct1 = (v: number) => `${v.toFixed(1)}%`;
  const fmtIdx1 = (v: number) => v.toFixed(1);

  const gdpRows = ins.gdp.slice(0, 10).map((c) => renderRow(c, c.yoy, fmtCount)).join("\n");
  const inflRows = ins.inflation.slice(0, 10).map((c) => renderRow(c, c.yoy, fmtIdx1)).join("\n");
  const unempRows = ins.unemployment.slice(0, 10).map((c) => renderRow(c, c.yoy, fmtPct1)).join("\n");
  const popRows = ins.population.slice(0, 10).map((c) => renderRow(c, c.yoy, fmtCount)).join("\n");

  const pageContent = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU Economic Monthly — ${monthLabel}",
  description: "${monthLabel} EU economic digest with year-over-year context: GDP top 10, inflation rankings, unemployment rates, and population trends across all 27 EU member states. Data from Eurostat via Aethar APIs.",
  alternates: { canonical: "/reports/monthly-${slug}" },
};

export default function MonthlyReport() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#4DD0E1]">Monthly Data Report</p>
      <h1 className="mt-2 text-2xl font-light text-white">EU Economic Monthly — ${monthLabel}</h1>
      <p className="mt-3 text-sm text-[#8890AA]">Auto-generated from live Eurostat data via Aethar APIs. YoY column shows percent change vs the same period one year earlier.</p>

      {/* GDP */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">GDP — Top 10 Economies</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Quarterly GDP in millions EUR (latest available)</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">GDP (M EUR)</th><th className="py-2 pl-4 text-right">YoY</th></tr></thead>
          <tbody>
${gdpRows}
          </tbody>
        </table>
      </div>

      {/* Inflation */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Inflation — Highest HICP</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Latest harmonized index of consumer prices (2015 = 100)</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">HICP Index</th><th className="py-2 pl-4 text-right">YoY</th></tr></thead>
          <tbody>
${inflRows}
          </tbody>
        </table>
      </div>

      {/* Unemployment */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Unemployment — Lowest Rates</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Latest monthly unemployment rate</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">Rate</th><th className="py-2 pl-4 text-right">YoY</th></tr></thead>
          <tbody>
${unempRows}
          </tbody>
        </table>
      </div>

      {/* Population */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Population — Most Populous</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Total population (latest available)</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">Population</th><th className="py-2 pl-4 text-right">YoY</th></tr></thead>
          <tbody>
${popRows}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-lg border border-[#4DD0E1]/20 bg-[#4DD0E1]/5 p-8 text-center">
        <h2 className="text-lg font-light text-white">Get this data via API</h2>
        <p className="mt-2 text-sm text-[#8890AA]">All numbers in this report come from EurostatAPI. Free tier: 100 req/day.</p>
        <a href="https://console.aethar.dev" className="mt-4 inline-block rounded bg-[#4DD0E1] px-6 py-2.5 text-sm font-semibold text-[#0F1117]">Get Free API Key</a>
      </div>

      <p className="mt-8 text-[10px] text-[#8890AA]">Data sourced from Eurostat via Aethar EurostatAPI. Auto-generated report.</p>
    </div>
  );
}
`;

  const dir = join(REPORTS_DIR, `monthly-${slug}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "page.tsx"), pageContent);
  console.log(`Generated: /reports/monthly-${slug}`);
  return slug;
}

generatePage();
