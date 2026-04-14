import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU Economic Snapshot — April 2026 | Aethar Data",
  description:
    "Weekly data report: GDP growth, inflation trends, unemployment rates, and population changes across 14 EU economies. Powered by Eurostat data via Aethar APIs.",
};

/* ------------------------------------------------------------------ */
/*  Hard-coded from generated JSON files (2026-04-14 snapshot)        */
/* ------------------------------------------------------------------ */

interface CountryRow {
  code: string;
  name: string;
  gdpQ4: number;          // EUR millions, Q4 2024
  gdpQoQ: number;         // % QoQ
  gdpYoY: number;         // % YoY
  inflationYoY: number;   // % Dec 2025 vs Dec 2024
  unemployment: number;   // % Feb 2026
  population: number;     // Jan 2025
  popChange: number;      // % YoY
}

const DATA: CountryRow[] = [
  { code: "DE", name: "Germany",     gdpQ4: 764056, gdpQoQ:  0.2, gdpYoY: -0.2, inflationYoY: 2.0, unemployment: 4.0,  population: 83577140, popChange:  0.15 },
  { code: "FR", name: "France",      gdpQ4: 588314, gdpQoQ:  0.0, gdpYoY:  0.7, inflationYoY: 0.7, unemployment: 7.8,  population: 68882600, popChange:  0.31 },
  { code: "IT", name: "Italy",       gdpQ4: 430853, gdpQoQ:  0.1, gdpYoY:  0.4, inflationYoY: 1.2, unemployment: 5.3,  population: 58943464, popChange: -0.05 },
  { code: "ES", name: "Spain",       gdpQ4: 324467, gdpQoQ:  0.8, gdpYoY:  3.7, inflationYoY: 3.0, unemployment: 9.8,  population: 49128297, popChange:  1.05 },
  { code: "NL", name: "Netherlands", gdpQ4: 201092, gdpQoQ:  0.4, gdpYoY:  2.2, inflationYoY: 2.7, unemployment: 4.1,  population: 18044027, popChange:  0.56 },
  { code: "PL", name: "Poland",      gdpQ4: 146259, gdpQoQ:  1.4, gdpYoY:  3.9, inflationYoY: 2.5, unemployment: 3.2,  population: 36497495, popChange: -0.34 },
  { code: "SE", name: "Sweden",      gdpQ4: 119240, gdpQoQ:  1.0, gdpYoY:  2.4, inflationYoY: 2.1, unemployment: 8.4,  population: 10587710, popChange:  0.34 },
  { code: "BE", name: "Belgium",     gdpQ4: 111610, gdpQoQ:  0.1, gdpYoY:  0.9, inflationYoY: 2.2, unemployment: 6.4,  population: 11883495, popChange:  0.56 },
  { code: "IE", name: "Ireland",     gdpQ4: 105029, gdpQoQ:  3.8, gdpYoY: 11.9, inflationYoY: 2.7, unemployment: 4.6,  population:  5440278, popChange:  1.66 },
  { code: "AT", name: "Austria",     gdpQ4:  86507, gdpQoQ:  0.5, gdpYoY:  0.3, inflationYoY: 3.8, unemployment: 5.8,  population:  9197213, popChange:  0.42 },
  { code: "DK", name: "Denmark",     gdpQ4:  78977, gdpQoQ:  1.2, gdpYoY:  4.2, inflationYoY: 1.9, unemployment: 7.5,  population:  5992734, popChange:  0.53 },
  { code: "PT", name: "Portugal",    gdpQ4:  52897, gdpQoQ:  1.2, gdpYoY:  2.6, inflationYoY: 2.4, unemployment: 5.8,  population: 10749635, popChange:  1.03 },
  { code: "CZ", name: "Czechia",     gdpQ4:  51438, gdpQoQ:  0.8, gdpYoY:  2.0, inflationYoY: 1.8, unemployment: 3.2,  population: 10909500, popChange:  0.08 },
  { code: "FI", name: "Finland",     gdpQ4:  51084, gdpQoQ: -0.3, gdpYoY:  1.4, inflationYoY: 1.7, unemployment: 10.6, population:  5635971, popChange:  0.57 },
];

/* ------------------------------------------------------------------ */

function fmt(n: number): string {
  return n.toLocaleString("en-IE");
}

function Badge({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const color =
    value > 0
      ? "text-emerald-400"
      : value < 0
        ? "text-red-400"
        : "text-[#8890AA]";
  return (
    <span className={`font-mono text-sm ${color}`}>
      {value > 0 ? "+" : ""}
      {value.toFixed(1)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */

export default function EUSnapshotApril2026() {
  const sortedByGdpYoY = [...DATA].sort((a, b) => b.gdpYoY - a.gdpYoY);
  const sortedByInflation = [...DATA].sort((a, b) => b.inflationYoY - a.inflationYoY);
  const sortedByUnemployment = [...DATA].sort((a, b) => a.unemployment - b.unemployment);
  const totalPop = DATA.reduce((s, d) => s + d.population, 0);

  return (
    <article className="mx-auto max-w-4xl">
      {/* Header */}
      <header className="border-b border-[#2A2D3A] pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#4DD0E1]">
          Weekly Data Report
        </p>
        <h1 className="mt-2 text-3xl font-light text-white md:text-4xl">
          EU Economic Snapshot — April 2026
        </h1>
        <p className="mt-3 text-sm text-[#8890AA]">
          Published 13 April 2026 &middot; Data from Eurostat via{" "}
          <a href="https://col.wageapi.com" className="text-[#4DD0E1] hover:underline">
            Aethar Eurostat API
          </a>
        </p>
        <p className="mt-4 text-[#E0E2EF]">
          Fourteen EU economies tracked across four key indicators: GDP, inflation
          (HICP), unemployment, and population. This report covers the most recent
          data available as of mid-April 2026.
        </p>
      </header>

      {/* ============================================================ */}
      {/*  Section 1 — GDP                                             */}
      {/* ============================================================ */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">
          GDP — Growth Diverges Sharply
        </h2>
        <p className="mt-3 text-sm text-[#E0E2EF]">
          Based on Q4 2024 national accounts (chain-linked volumes, 2010 prices). The
          gap between EU growth leaders and laggards has widened: Ireland, Denmark,
          Poland, and Spain posted the strongest year-on-year expansions while Germany
          remained the only economy in contraction.
        </p>

        {/* Top / Bottom cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Fastest Growing (YoY)
            </p>
            <ul className="mt-3 space-y-2">
              {sortedByGdpYoY.slice(0, 4).map((d) => (
                <li key={d.code} className="flex items-center justify-between text-sm">
                  <span className="text-[#E0E2EF]">{d.name}</span>
                  <Badge value={d.gdpYoY} />
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-red-900/40 bg-red-950/20 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
              Slowest / Contracting (YoY)
            </p>
            <ul className="mt-3 space-y-2">
              {sortedByGdpYoY.slice(-4).reverse().map((d) => (
                <li key={d.code} className="flex items-center justify-between text-sm">
                  <span className="text-[#E0E2EF]">{d.name}</span>
                  <Badge value={d.gdpYoY} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Full GDP table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]">
                <th className="pb-2 pr-4">Country</th>
                <th className="pb-2 pr-4 text-right">Q4 2024 (EUR m)</th>
                <th className="pb-2 pr-4 text-right">QoQ</th>
                <th className="pb-2 text-right">YoY</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((d) => (
                <tr key={d.code} className="border-b border-[#2A2D3A]/50">
                  <td className="py-2 pr-4 text-[#E0E2EF]">{d.name}</td>
                  <td className="py-2 pr-4 text-right font-mono text-[#8890AA]">
                    {fmt(d.gdpQ4)}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    <Badge value={d.gdpQoQ} />
                  </td>
                  <td className="py-2 text-right">
                    <Badge value={d.gdpYoY} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-[#8890AA]">
          Ireland&apos;s +11.9% YoY figure reflects multinational accounting effects
          common in Irish GDP data. Excluding Ireland, the strongest real economy
          performer is Denmark at +4.2%.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Inflation                                       */}
      {/* ============================================================ */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-white">
          Inflation — Austria Runs Hot, France Cools
        </h2>
        <p className="mt-3 text-sm text-[#E0E2EF]">
          Year-on-year change in the Harmonised Index of Consumer Prices (HICP,
          2015=100) as of December 2025. Most countries hover near the ECB&apos;s 2%
          target, but Austria (3.8%) and Spain (3.0%) remain elevated while France
          (0.7%) is the coolest in the sample.
        </p>

        <div className="mt-6 space-y-2">
          {sortedByInflation.map((d) => {
            const maxBar = 4;
            const width = Math.min((d.inflationYoY / maxBar) * 100, 100);
            const isHigh = d.inflationYoY > 2.5;
            return (
              <div key={d.code} className="flex items-center gap-3">
                <span className="w-28 text-sm text-[#E0E2EF]">{d.name}</span>
                <div className="flex-1">
                  <div
                    className={`h-5 rounded-sm ${isHigh ? "bg-amber-500/70" : "bg-[#4DD0E1]/60"}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="w-14 text-right font-mono text-sm text-[#E0E2EF]">
                  {d.inflationYoY.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-[#8890AA]">
          Bars in amber indicate above 2.5%. The ECB&apos;s medium-term target is 2.0%.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Unemployment                                    */}
      {/* ============================================================ */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-white">
          Unemployment — Tight Markets in Central Europe
        </h2>
        <p className="mt-3 text-sm text-[#E0E2EF]">
          Seasonally adjusted rates for February 2026. Czechia and Poland share the
          lowest rate at 3.2%, reflecting persistently tight Central European labour
          markets. Finland (10.6%) and Spain (9.8%) sit at the opposite end.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedByUnemployment.map((d) => {
            const severity =
              d.unemployment < 5
                ? "border-emerald-800/40 bg-emerald-950/10"
                : d.unemployment < 8
                  ? "border-[#2A2D3A] bg-[#1C1F29]"
                  : "border-red-900/40 bg-red-950/10";
            return (
              <div
                key={d.code}
                className={`rounded-lg border p-4 ${severity}`}
              >
                <p className="text-xs text-[#8890AA]">{d.name}</p>
                <p className="mt-1 text-2xl font-light text-white">
                  {d.unemployment.toFixed(1)}
                  <span className="text-sm text-[#8890AA]">%</span>
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 4 — Population                                      */}
      {/* ============================================================ */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-white">
          Population — Ireland and Spain Lead Growth
        </h2>
        <p className="mt-3 text-sm text-[#E0E2EF]">
          January 2025 estimates. Total tracked population across 14 countries:{" "}
          <strong className="text-white">{fmt(totalPop)}</strong>. Ireland (+1.66%)
          and Spain (+1.05%) saw the strongest growth, driven by net migration. Italy
          (-0.05%) and Poland (-0.34%) are the only countries recording declines.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]">
                <th className="pb-2 pr-4">Country</th>
                <th className="pb-2 pr-4 text-right">Population</th>
                <th className="pb-2 text-right">YoY Change</th>
              </tr>
            </thead>
            <tbody>
              {[...DATA]
                .sort((a, b) => b.population - a.population)
                .map((d) => (
                  <tr key={d.code} className="border-b border-[#2A2D3A]/50">
                    <td className="py-2 pr-4 text-[#E0E2EF]">{d.name}</td>
                    <td className="py-2 pr-4 text-right font-mono text-[#8890AA]">
                      {fmt(d.population)}
                    </td>
                    <td className="py-2 text-right">
                      <Badge value={d.popChange} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Key Takeaways                                               */}
      {/* ============================================================ */}
      <section className="mt-14 rounded-lg border border-[#2A2D3A] bg-[#1C1F29] p-6">
        <h2 className="text-lg font-semibold text-white">Key Takeaways</h2>
        <ul className="mt-4 space-y-3 text-sm text-[#E0E2EF]">
          <li className="flex gap-2">
            <span className="mt-0.5 text-[#4DD0E1]">1.</span>
            <span>
              <strong className="text-white">Growth is uneven.</strong> Germany
              contracted YoY while Spain, Poland, and Denmark grew 3-4%. The
              two-speed EU economy narrative is backed by the data.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 text-[#4DD0E1]">2.</span>
            <span>
              <strong className="text-white">Inflation is converging — mostly.</strong>{" "}
              Ten of 14 countries are within 1.7-2.7%, close to the ECB target.
              Austria at 3.8% is the outlier to watch.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 text-[#4DD0E1]">3.</span>
            <span>
              <strong className="text-white">Labour markets are splitting.</strong>{" "}
              Central Europe (Czechia, Poland) runs near full employment while
              Nordic/Southern periphery (Finland, Spain) sees rates nearing double
              digits.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 text-[#4DD0E1]">4.</span>
            <span>
              <strong className="text-white">Population shifts continue.</strong>{" "}
              Migration-driven growth in Ireland and Spain contrasts with demographic
              decline in Poland and stagnation in Italy.
            </span>
          </li>
        </ul>
      </section>

      {/* ============================================================ */}
      {/*  Methodology + CTA                                           */}
      {/* ============================================================ */}
      <section className="mt-10 text-xs text-[#8890AA]">
        <h3 className="font-semibold text-[#E0E2EF]">Methodology</h3>
        <p className="mt-1">
          All data sourced from Eurostat via the Aethar Eurostat API. GDP: chain-linked
          volumes (CLV10_MEUR), quarterly. Inflation: HICP all-items index
          (2015=100), monthly. Unemployment: seasonally adjusted rates, monthly.
          Population: annual estimates on 1 January.
        </p>
      </section>

      {/* CTA */}
      <div className="mt-12 rounded-lg border border-[#4DD0E1]/20 bg-[#4DD0E1]/5 p-8 text-center">
        <h2 className="text-xl font-light text-white">
          Build on this data with the Aethar API
        </h2>
        <p className="mt-2 text-sm text-[#8890AA]">
          Clean JSON endpoints for Eurostat data. No SDMX. Free tier with 100
          requests/day. MCP-ready for AI agents.
        </p>
        <a
          href="https://console.aethar.dev"
          className="mt-4 inline-block rounded bg-[#4DD0E1] px-6 py-2.5 text-sm font-semibold text-[#0F1117] transition-colors hover:bg-[#4DD0E1]/90"
        >
          Get Free API Key
        </a>
      </div>
    </article>
  );
}
