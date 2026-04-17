import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { countryFlag } from "@/lib/countries";

const TOPIC_LABELS: Record<string, string> = {
  gdp: "GDP",
  inflation: "Inflation (HICP)",
  unemployment: "Unemployment rate",
  population: "Population",
};

const TOPIC_UNIT: Record<string, string> = {
  gdp: "EUR m",
  inflation: "index",
  unemployment: "%",
  population: "persons",
};

const DATA_DIR = join(process.cwd(), "data", "generated", "compare");

export function generateStaticParams() {
  const params: { topic: string; pair: string }[] = [];
  for (const topic of Object.keys(TOPIC_LABELS)) {
    const dir = join(DATA_DIR, topic);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      params.push({ topic, pair: f.replace(".json", "") });
    }
  }
  return params;
}

function loadData(topic: string, pair: string) {
  const file = join(DATA_DIR, topic, `${pair}.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf-8"));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; pair: string }>;
}): Promise<Metadata> {
  const { topic, pair } = await params;
  const data = loadData(topic, pair);
  const topicLabel = TOPIC_LABELS[topic] ?? topic;
  const name1 = data?.country1?.country?.name ?? pair.split("-vs-")[0].toUpperCase();
  const name2 = data?.country2?.country?.name ?? pair.split("-vs-")[1].toUpperCase();
  const year = new Date().getFullYear();

  return {
    title: `${name1} vs ${name2} — ${topicLabel} Comparison ${year}`,
    description: `Compare ${topicLabel} between ${name1} and ${name2} (${year}). Side-by-side data, historical trends, and API access. Source: Eurostat via Aethar API.`,
  };
}

type Observation = Record<string, unknown> & { period?: string };

function extractRecords(countryData: unknown): Observation[] {
  const d = (countryData as { data?: unknown })?.data;
  if (Array.isArray(d)) return d as Observation[];
  const obs = (d as { observations?: unknown })?.observations;
  if (Array.isArray(obs)) return obs as Observation[];
  return [];
}

function getVal(d: Observation): number | null {
  const raw = d.value ?? d.rate ?? d.population ?? d.index_value;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  return null;
}

function formatValue(v: number | null, topic: string): string {
  if (v === null) return "—";
  if (topic === "unemployment" || topic === "inflation") {
    return v.toLocaleString("en-IE", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }
  return v.toLocaleString("en-IE", { maximumFractionDigits: 1 });
}

function formatPeriod(p: string | undefined): string {
  if (!p) return "—";
  const match = /^(\d{4})-(\d{2})/.exec(p);
  if (!match) return p;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[Number(match[2]) - 1] ?? match[2]} ${match[1]}`;
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ topic: string; pair: string }>;
}) {
  const { topic, pair } = await params;
  const data = loadData(topic, pair);
  const topicLabel = TOPIC_LABELS[topic] ?? topic;
  const unit = TOPIC_UNIT[topic] ?? "";

  if (!data) {
    return (
      <div className="err-notfound">
        <p className="err-crumbs">
          <Link href="/">Home</Link>
          <span className="err-crumbs-sep">/</span>
          <span className="err-crumbs-cat">{pair}</span>
        </p>
        <h1>Comparison not available</h1>
        <p>Data for this comparison hasn&apos;t been generated yet.</p>
        <Link href="/" className="btn-primary">Back to homepage</Link>
      </div>
    );
  }

  const c1 = data.country1.country;
  const c2 = data.country2.country;
  const recs1 = extractRecords(data.country1);
  const recs2 = extractRecords(data.country2);

  // Dedupe by period
  const byPeriod = (recs: Observation[]) => {
    const m = new Map<string, Observation>();
    for (const r of recs) if (r.period) m.set(String(r.period), r);
    return Array.from(m.values()).sort((a, b) => String(a.period).localeCompare(String(b.period)));
  };
  const sorted1 = byPeriod(recs1);
  const sorted2 = byPeriod(recs2);

  const latest1 = sorted1[sorted1.length - 1];
  const latest2 = sorted2[sorted2.length - 1];
  const val1 = latest1 ? getVal(latest1) : null;
  const val2 = latest2 ? getVal(latest2) : null;

  const diff = val1 !== null && val2 !== null && val2 !== 0
    ? ((val1 - val2) / val2) * 100
    : null;

  // Merge periods for comparison table
  const allPeriods = new Set<string>();
  for (const r of sorted1) if (r.period) allPeriods.add(String(r.period));
  for (const r of sorted2) if (r.period) allPeriods.add(String(r.period));
  const periods = Array.from(allPeriods).sort().slice(-16);

  const map1 = new Map(sorted1.map(r => [String(r.period), r]));
  const map2 = new Map(sorted2.map(r => [String(r.period), r]));

  return (
    <article>
      <nav className="err-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="err-crumbs-sep">/</span>
        <Link href={`/${topic}`}>{topicLabel}</Link>
        <span className="err-crumbs-sep">/</span>
        <span className="err-crumbs-cat">{c1.name} vs {c2.name}</span>
      </nav>

      <p className="err-kicker" style={{ marginTop: 18 }}>Comparison</p>
      <h1 className="err-h1">
        {countryFlag(c1.code)} {c1.name} vs {countryFlag(c2.code)} {c2.name}
      </h1>
      <p className="err-lede">{topicLabel} — side-by-side comparison with historical data from Eurostat.</p>

      {/* Hero comparison */}
      <div className="err-stat-row" style={{ marginTop: 32, maxWidth: "100%" }}>
        <div className="err-stat" style={{ flex: 2 }}>
          <div className="err-stat-label">{countryFlag(c1.code)} {c1.name}</div>
          <div className="err-stat-value" style={{ color: "var(--accent)" }}>
            {formatValue(val1, topic)}
          </div>
          <div className="err-stat-label">{unit} · {formatPeriod(latest1?.period as string)}</div>
        </div>
        <div className="err-stat" style={{ flex: 1, textAlign: "center" }}>
          <div className="err-stat-label">Difference</div>
          <div className="err-stat-value" style={{ color: diff !== null && diff > 0 ? "var(--accent)" : diff !== null && diff < 0 ? "var(--danger)" : "var(--fg-2)" }}>
            {diff !== null ? `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%` : "—"}
          </div>
          <div className="err-stat-label">{c1.code} vs {c2.code}</div>
        </div>
        <div className="err-stat" style={{ flex: 2 }}>
          <div className="err-stat-label">{countryFlag(c2.code)} {c2.name}</div>
          <div className="err-stat-value">
            {formatValue(val2, topic)}
          </div>
          <div className="err-stat-label">{unit} · {formatPeriod(latest2?.period as string)}</div>
        </div>
      </div>

      {/* Comparison table */}
      <section style={{ marginTop: 48 }}>
        <h2 className="err-category-title">Historical comparison</h2>
        <table className="data-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Period</th>
              <th style={{ textAlign: "right" }}>{countryFlag(c1.code)} {c1.name}</th>
              <th style={{ textAlign: "right" }}>{countryFlag(c2.code)} {c2.name}</th>
              <th style={{ textAlign: "right" }}>Diff %</th>
            </tr>
          </thead>
          <tbody>
            {periods.reverse().map((period) => {
              const v1 = map1.has(period) ? getVal(map1.get(period)!) : null;
              const v2 = map2.has(period) ? getVal(map2.get(period)!) : null;
              const d = v1 !== null && v2 !== null && v2 !== 0
                ? ((v1 - v2) / v2) * 100
                : null;
              const isLatest = period === String(latest1?.period) || period === String(latest2?.period);

              return (
                <tr key={period} className={isLatest ? "is-latest" : ""}>
                  <td>{formatPeriod(period)}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
                    {formatValue(v1, topic)}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
                    {formatValue(v2, topic)}
                  </td>
                  <td style={{
                    textAlign: "right",
                    fontFamily: "var(--font-mono)",
                    fontVariantNumeric: "tabular-nums",
                    color: d !== null && d > 0 ? "var(--accent)" : d !== null && d < 0 ? "var(--danger)" : "var(--fg-3)",
                  }}>
                    {d !== null ? `${d > 0 ? "+" : ""}${d.toFixed(1)}%` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* API CTA */}
      <aside className="err-cta" style={{ marginTop: 48 }}>
        <p className="err-cta-label">Build with this data</p>
        <p className="err-cta-title">Access via API</p>
        <p className="err-cta-body">
          Get {topicLabel.toLowerCase()} data for {c1.name}, {c2.name}, and 25+ more EU countries via clean
          JSON endpoints. Free tier: 100 requests/day.
        </p>
        <div className="err-cta-actions">
          <a href="https://console.aethar.dev" className="btn-primary">Get API Key</a>
          <a href="https://eurostat.wageapi.com/docs" className="btn-secondary">Documentation</a>
        </div>
      </aside>
    </article>
  );
}
