import type { Metadata } from "next";
import Link from "next/link";
import { countryFlag } from "@/lib/countries";

export const metadata: Metadata = {
  title: "EU Economic Weekly — April 2026",
  description:
    "Weekly EU economic data digest: GDP rankings, inflation trends, unemployment rates across EU member states. April 2026.",
};

/* ------------------------------------------------------------------ */
/*  Auto-generated placeholder rows. Replace these arrays with the    */
/*  output of the weekly generator once wired up — the shape stays    */
/*  identical so no template changes are needed.                      */
/* ------------------------------------------------------------------ */

interface Row {
  code: string;
  name: string;
  value: number;
}

const GDP_ROWS: Row[] = [
  { code: "AT", name: "Austria",     value: 0 },
  { code: "BE", name: "Belgium",     value: 0 },
  { code: "CZ", name: "Czechia",     value: 0 },
  { code: "DE", name: "Germany",     value: 0 },
  { code: "DK", name: "Denmark",     value: 0 },
  { code: "ES", name: "Spain",       value: 0 },
  { code: "FI", name: "Finland",     value: 0 },
  { code: "FR", name: "France",      value: 0 },
  { code: "IE", name: "Ireland",     value: 0 },
  { code: "IT", name: "Italy",       value: 0 },
];

const INFLATION_ROWS: Row[] = GDP_ROWS.map((r) => ({ ...r, value: 0 }));
const UNEMPLOYMENT_ROWS: Row[] = GDP_ROWS.map((r) => ({ ...r, value: 0 }));

function fmtInt(n: number): string {
  return n.toLocaleString("en-IE");
}

function fmtDecimal(n: number): string {
  return n.toLocaleString("en-IE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function RankingTable({
  rows,
  valueHeader,
  format,
  suffix = "",
}: {
  rows: Row[];
  valueHeader: string;
  format: (n: number) => string;
  suffix?: string;
}) {
  return (
    <div className="data-table-wrap" style={{ marginTop: 16 }}>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 48 }}>#</th>
            <th>Country</th>
            <th className="num">{valueHeader}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.code}>
              <td className="rank">
                {(i + 1).toString().padStart(2, "0")}
              </td>
              <td>
                <span className="country-cell">
                  <span className="country-cell-flag" aria-hidden="true">
                    {countryFlag(r.code)}
                  </span>
                  {r.name}
                </span>
              </td>
              <td className="num accent">
                {format(r.value)}
                {suffix}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function WeeklyReport() {
  return (
    <article>
      <nav className="err-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="err-crumbs-sep">/</span>
        <span className="err-crumbs-cat">Reports</span>
        <span className="err-crumbs-sep">/</span>
        <span className="err-crumbs-cat">Weekly &middot; 2026-W15</span>
      </nav>

      <header className="report-head" style={{ marginTop: 22 }}>
        <p className="err-kicker">Weekly data report</p>
        <h1 className="err-h1">EU Economic Weekly &mdash; April 2026</h1>
        <div className="report-head-meta">
          <span>Week 15 of 2026</span>
          <span>Auto-generated</span>
          <span>
            Source:{" "}
            <a href="https://col.wageapi.com">Aethar Eurostat API</a>
          </span>
        </div>
        <p className="report-lede">
          Snapshot of GDP, inflation, and unemployment across EU member states
          for the latest available reporting period. Numbers refresh
          automatically from live Eurostat data.
        </p>
      </header>

      <section className="report-section">
        <p className="report-section-label">Section 01 &middot; GDP</p>
        <h2 className="report-section-heading">Top 10 economies</h2>
        <p className="report-section-body">
          Quarterly GDP in millions of euros, latest available period.
        </p>
        <RankingTable
          rows={GDP_ROWS}
          valueHeader="GDP (EUR m)"
          format={fmtInt}
        />
      </section>

      <section className="report-section">
        <p className="report-section-label">Section 02 &middot; Inflation</p>
        <h2 className="report-section-heading">HICP index (2015 = 100)</h2>
        <p className="report-section-body">
          Latest harmonised index of consumer prices.
        </p>
        <RankingTable
          rows={INFLATION_ROWS}
          valueHeader="HICP index"
          format={fmtDecimal}
        />
      </section>

      <section className="report-section">
        <p className="report-section-label">Section 03 &middot; Unemployment</p>
        <h2 className="report-section-heading">Lowest rates</h2>
        <p className="report-section-body">
          Latest monthly unemployment rate, seasonally adjusted.
        </p>
        <RankingTable
          rows={UNEMPLOYMENT_ROWS}
          valueHeader="Rate"
          format={fmtDecimal}
          suffix="%"
        />
      </section>

      <aside className="report-cta">
        <p className="report-cta-label">API access</p>
        <p className="report-cta-title">Get this data via API</p>
        <p className="report-cta-body">
          All data in this report is available through the Aethar Eurostat API.
          Free tier: 100 requests/day. Clean JSON, MCP-ready for agents.
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

      <p className="source-note">
        <strong>Source:</strong> Eurostat via Aethar Eurostat API. Auto-generated
        weekly report.
      </p>
    </article>
  );
}
