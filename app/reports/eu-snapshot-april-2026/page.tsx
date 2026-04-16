import type { Metadata } from "next";
import Link from "next/link";
import { countryFlag } from "@/lib/countries";

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
  gdpQ4: number; // EUR millions, Q4 2024
  gdpQoQ: number; // % QoQ
  gdpYoY: number; // % YoY
  inflationYoY: number; // % Dec 2025 vs Dec 2024
  unemployment: number; // % Feb 2026
  population: number; // Jan 2025
  popChange: number; // % YoY
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

function deltaClass(value: number): string {
  if (value > 0) return "delta delta--up";
  if (value < 0) return "delta delta--down";
  return "delta delta--flat";
}

function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  return (
    <span className={deltaClass(value)}>
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
  const maxInflation = Math.max(...DATA.map((d) => d.inflationYoY), 4);

  return (
    <article>
      <nav className="err-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="err-crumbs-sep">/</span>
        <span className="err-crumbs-cat">Reports</span>
        <span className="err-crumbs-sep">/</span>
        <span className="err-crumbs-cat">EU Snapshot &middot; April 2026</span>
      </nav>

      <header className="report-head" style={{ marginTop: 22 }}>
        <p className="err-kicker">Weekly data report</p>
        <h1 className="err-h1">EU Economic Snapshot &mdash; April 2026</h1>
        <div className="report-head-meta">
          <span>Published 13 April 2026</span>
          <span>14 countries &middot; 4 indicators</span>
          <span>
            Source:{" "}
            <a href="https://col.wageapi.com">Aethar Eurostat API</a>
          </span>
        </div>
        <p className="report-lede">
          Fourteen EU economies tracked across four key indicators: GDP, inflation
          (HICP), unemployment, and population. This report covers the most recent
          data available as of mid-April 2026.
        </p>
      </header>

      {/* =================== GDP =================== */}
      <section className="report-section">
        <p className="report-section-label">Section 01 &middot; GDP</p>
        <h2 className="report-section-heading">Growth diverges sharply</h2>
        <p className="report-section-body">
          Based on Q4 2024 national accounts (chain-linked volumes, 2010 prices).
          The gap between EU growth leaders and laggards has widened: Ireland,
          Denmark, Poland, and Spain posted the strongest year-on-year
          expansions while Germany remained the only economy in contraction.
        </p>

        <div className="ranking-pair">
          <div className="ranking-card ranking-card--positive">
            <p className="ranking-card-label">Fastest growing &middot; YoY</p>
            <ul className="ranking-card-list">
              {sortedByGdpYoY.slice(0, 4).map((d) => (
                <li key={d.code} className="ranking-card-row">
                  <span className="ranking-card-row-name">
                    <span className="ranking-card-row-flag" aria-hidden="true">
                      {countryFlag(d.code)}
                    </span>
                    {d.name}
                  </span>
                  <Delta value={d.gdpYoY} />
                </li>
              ))}
            </ul>
          </div>
          <div className="ranking-card ranking-card--negative">
            <p className="ranking-card-label">Slowest / contracting &middot; YoY</p>
            <ul className="ranking-card-list">
              {sortedByGdpYoY
                .slice(-4)
                .reverse()
                .map((d) => (
                  <li key={d.code} className="ranking-card-row">
                    <span className="ranking-card-row-name">
                      <span
                        className="ranking-card-row-flag"
                        aria-hidden="true"
                      >
                        {countryFlag(d.code)}
                      </span>
                      {d.name}
                    </span>
                    <Delta value={d.gdpYoY} />
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="data-table-wrap" style={{ marginTop: 22 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Country</th>
                <th className="num">Q4 2024 (EUR m)</th>
                <th className="num">QoQ</th>
                <th className="num">YoY</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((d) => (
                <tr key={d.code}>
                  <td>
                    <span className="country-cell">
                      <span className="country-cell-flag" aria-hidden="true">
                        {countryFlag(d.code)}
                      </span>
                      {d.name}
                    </span>
                  </td>
                  <td className="num muted">{fmt(d.gdpQ4)}</td>
                  <td className="num">
                    <Delta value={d.gdpQoQ} />
                  </td>
                  <td className="num">
                    <Delta value={d.gdpYoY} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="report-footnote">
          Ireland&apos;s +11.9% YoY figure reflects multinational accounting
          effects common in Irish GDP data. Excluding Ireland, the strongest
          real economy performer is Denmark at +4.2%.
        </p>
      </section>

      {/* =================== Inflation =================== */}
      <section className="report-section">
        <p className="report-section-label">Section 02 &middot; Inflation</p>
        <h2 className="report-section-heading">
          Austria runs hot, France cools
        </h2>
        <p className="report-section-body">
          Year-on-year change in the Harmonised Index of Consumer Prices (HICP,
          2015 = 100) as of December 2025. Most countries hover near the
          ECB&apos;s 2% target, but Austria (3.8%) and Spain (3.0%) remain
          elevated while France (0.7%) is the coolest in the sample.
        </p>

        <div className="bar-list" style={{ marginTop: 22 }}>
          {sortedByInflation.map((d) => {
            const width = Math.min(
              (d.inflationYoY / maxInflation) * 100,
              100,
            );
            const isHigh = d.inflationYoY > 2.5;
            return (
              <div key={d.code} className="bar-row">
                <span className="bar-row-name">
                  <span aria-hidden="true">{countryFlag(d.code)}</span>
                  {d.name}
                </span>
                <div
                  className="bar-track"
                  aria-label={`${d.name} inflation ${d.inflationYoY}%`}
                >
                  <span
                    className={`bar-fill ${isHigh ? "bar-fill--warn" : ""}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="bar-row-value">
                  {d.inflationYoY.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>

        <p className="report-footnote">
          Bars in amber indicate inflation above 2.5%. The ECB&apos;s medium-term
          target is 2.0%.
        </p>
      </section>

      {/* =================== Unemployment =================== */}
      <section className="report-section">
        <p className="report-section-label">Section 03 &middot; Unemployment</p>
        <h2 className="report-section-heading">
          Tight markets in Central Europe
        </h2>
        <p className="report-section-body">
          Seasonally adjusted rates for February 2026. Czechia and Poland share
          the lowest rate at 3.2%, reflecting persistently tight Central
          European labour markets. Finland (10.6%) and Spain (9.8%) sit at the
          opposite end.
        </p>

        <div className="stat-tile-grid">
          {sortedByUnemployment.map((d) => {
            const severity =
              d.unemployment < 5
                ? "stat-tile stat-tile--low"
                : d.unemployment > 8
                  ? "stat-tile stat-tile--high"
                  : "stat-tile";
            return (
              <div key={d.code} className={severity}>
                <span className="stat-tile-name">
                  <span aria-hidden="true">{countryFlag(d.code)}</span>
                  {d.name}
                </span>
                <span className="stat-tile-value">
                  {d.unemployment.toFixed(1)}
                  <span className="unit">%</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================== Population =================== */}
      <section className="report-section">
        <p className="report-section-label">Section 04 &middot; Population</p>
        <h2 className="report-section-heading">
          Ireland and Spain lead growth
        </h2>
        <p className="report-section-body">
          January 2025 estimates. Total tracked population across 14 countries:{" "}
          <strong>{fmt(totalPop)}</strong>. Ireland (+1.66%) and Spain (+1.05%)
          saw the strongest growth, driven by net migration. Italy (&minus;0.05%)
          and Poland (&minus;0.34%) are the only countries recording declines.
        </p>

        <div className="data-table-wrap" style={{ marginTop: 22 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Country</th>
                <th className="num">Population</th>
                <th className="num">YoY change</th>
              </tr>
            </thead>
            <tbody>
              {[...DATA]
                .sort((a, b) => b.population - a.population)
                .map((d) => (
                  <tr key={d.code}>
                    <td>
                      <span className="country-cell">
                        <span className="country-cell-flag" aria-hidden="true">
                          {countryFlag(d.code)}
                        </span>
                        {d.name}
                      </span>
                    </td>
                    <td className="num muted">{fmt(d.population)}</td>
                    <td className="num">
                      <Delta value={d.popChange} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* =================== Takeaways =================== */}
      <section className="report-section">
        <p className="report-section-label">Summary</p>
        <h2 className="report-section-heading">Key takeaways</h2>
        <div className="takeaways">
          <p className="takeaways-title">Four signals from this snapshot</p>
          <ol className="takeaways-list">
            <li className="takeaways-item">
              <strong>Growth is uneven.</strong> Germany contracted YoY while
              Spain, Poland, and Denmark grew 3&ndash;4%. The two-speed EU
              economy narrative is backed by the data.
            </li>
            <li className="takeaways-item">
              <strong>Inflation is converging &mdash; mostly.</strong> Ten of 14
              countries are within 1.7&ndash;2.7%, close to the ECB target.
              Austria at 3.8% is the outlier to watch.
            </li>
            <li className="takeaways-item">
              <strong>Labour markets are splitting.</strong> Central Europe
              (Czechia, Poland) runs near full employment while the
              Nordic/Southern periphery (Finland, Spain) sees rates nearing
              double digits.
            </li>
            <li className="takeaways-item">
              <strong>Population shifts continue.</strong> Migration-driven
              growth in Ireland and Spain contrasts with demographic decline in
              Poland and stagnation in Italy.
            </li>
          </ol>
        </div>
      </section>

      {/* =================== Methodology =================== */}
      <section className="report-section">
        <p className="report-section-label">Methodology</p>
        <h2 className="report-section-heading">How this report is built</h2>
        <p className="report-section-body">
          All data sourced from Eurostat via the Aethar Eurostat API. GDP:
          chain-linked volumes (CLV10_MEUR), quarterly. Inflation: HICP
          all-items index (2015 = 100), monthly. Unemployment: seasonally
          adjusted rates, monthly. Population: annual estimates on 1 January.
        </p>
      </section>

      <aside className="report-cta">
        <p className="report-cta-label">API access</p>
        <p className="report-cta-title">Build on this data</p>
        <p className="report-cta-body">
          Every figure in this report is available via a single REST endpoint.
          Free tier with 100 requests/day, clean JSON, MCP-ready for agent
          runtimes.
        </p>
        <div className="report-cta-actions">
          <a href="https://console.aethar.dev" className="btn-primary">
            Get free API key
          </a>
          <a href="https://eurostat.wageapi.com/docs" className="btn-secondary">
            Read the docs
          </a>
        </div>
      </aside>
    </article>
  );
}
