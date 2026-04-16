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

const DATA_DIR = join(process.cwd(), "data", "generated");

export function generateStaticParams() {
  const params: { topic: string; country: string }[] = [];
  for (const topic of Object.keys(TOPIC_LABELS)) {
    const dir = join(DATA_DIR, topic);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      params.push({ topic, country: f.replace(".json", "") });
    }
  }
  return params;
}

function loadData(topic: string, country: string) {
  const file = join(DATA_DIR, topic, `${country}.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf-8"));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; country: string }>;
}): Promise<Metadata> {
  const { topic, country } = await params;
  const pageData = loadData(topic, country);
  const countryName = pageData?.country?.name ?? country.toUpperCase();
  const topicLabel = TOPIC_LABELS[topic] ?? topic;
  const year = new Date().getFullYear();

  return {
    title: `${countryName} ${topicLabel} ${year} — EU Economic Data`,
    description: `${topicLabel} data for ${countryName} (${year}). Historical trends, latest figures, and API access. Source: Eurostat via Aethar API.`,
  };
}

type Observation = Record<string, unknown> & { period?: string };

function extractRecords(pageData: unknown): Observation[] {
  const dataField = (pageData as { data?: unknown })?.data;
  if (Array.isArray(dataField)) return dataField as Observation[];
  const observations = (dataField as { observations?: unknown })?.observations;
  if (Array.isArray(observations)) return observations as Observation[];
  return [];
}

function getVal(d: Observation): number | null {
  const raw = d.value ?? d.rate ?? d.population ?? d.index_value;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "" && !Number.isNaN(Number(raw))) {
    return Number(raw);
  }
  return null;
}

function formatValue(v: number | null, topic: string): string {
  if (v === null) return "—";
  if (topic === "unemployment" || topic === "inflation") {
    return v.toLocaleString("en-IE", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    });
  }
  return v.toLocaleString("en-IE", { maximumFractionDigits: 1 });
}

function formatPeriod(p: string | undefined): string {
  if (!p) return "—";
  // e.g. 2024-10-01 -> Oct 2024 ; 2025-01 -> Jan 2025
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(p);
  if (!match) return p;
  const [, year, month] = match;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const idx = Number(month) - 1;
  if (idx < 0 || idx > 11) return p;
  return `${monthNames[idx]} ${year}`;
}

export default async function CountryDataPage({
  params,
}: {
  params: Promise<{ topic: string; country: string }>;
}) {
  const { topic, country } = await params;
  const pageData = loadData(topic, country);
  const topicLabel = TOPIC_LABELS[topic] ?? topic;
  const topicUnit = TOPIC_UNIT[topic] ?? "";

  if (!pageData) {
    return (
      <div className="err-notfound">
        <p className="err-crumbs">
          <Link href={`/${topic}`}>{topicLabel}</Link>
          <span className="err-crumbs-sep">/</span>
          <span className="err-crumbs-cat">{country.toUpperCase()}</span>
        </p>
        <h1>No data available</h1>
        <p>
          We don&apos;t have <code>{topicLabel}</code> data for{" "}
          <code>{country.toUpperCase()}</code> yet. Try another country or
          browse the full{" "}
          <Link
            href={`/${topic}`}
            style={{
              color: "var(--accent)",
              borderBottom: "1px solid rgba(0,254,39,0.3)",
            }}
          >
            {topicLabel} index
          </Link>
          .
        </p>
      </div>
    );
  }

  const countryInfo = pageData.country;
  const records: Observation[] = extractRecords(pageData);
  const generatedAt: string | undefined = pageData.generatedAt;

  // Deduplicate observations by period (same date can appear twice in source)
  const byPeriod = new Map<string, Observation>();
  for (const rec of records) {
    const key = String(rec.period ?? "");
    if (!key) continue;
    byPeriod.set(key, rec);
  }
  const uniqueSorted = Array.from(byPeriod.values()).sort((a, b) =>
    String(a.period).localeCompare(String(b.period)),
  );

  const latest = uniqueSorted[uniqueSorted.length - 1];
  const previous = uniqueSorted[uniqueSorted.length - 2];
  const earliest = uniqueSorted[0];

  const latestVal = latest ? getVal(latest) : null;
  const previousVal = previous ? getVal(previous) : null;
  const delta =
    latestVal !== null && previousVal !== null
      ? latestVal - previousVal
      : null;
  const deltaPct =
    delta !== null && previousVal !== null && previousVal !== 0
      ? (delta / previousVal) * 100
      : null;

  const curlEndpoint = `https://eurostat.wageapi.com/v1/${topic}?country=${countryInfo.code}`;
  const curlSnippet = `curl -H "X-API-Key: $AETHAR_KEY" \\
  "${curlEndpoint}"`;

  return (
    <article>
      <nav className="err-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="err-crumbs-sep">/</span>
        <Link href={`/${topic}`}>{topicLabel}</Link>
        <span className="err-crumbs-sep">/</span>
        <span className="err-crumbs-cat">{countryInfo.name}</span>
      </nav>

      <div className="country-head">
        <span className="country-head-flag" aria-hidden="true">
          {countryFlag(countryInfo.code)}
        </span>
        <div>
          <p className="country-head-topic">{topicLabel}</p>
          <h1 className="country-head-title">{countryInfo.name}</h1>
        </div>
      </div>

      {latest && (
        <section className="country-hero">
          <div className="country-hero-main">
            <p className="country-hero-label">Latest observation</p>
            <p className="country-hero-value">
              {formatValue(latestVal, topic)}
              {topicUnit && <span className="unit">{topicUnit}</span>}
            </p>
            <p className="country-hero-period">
              Period <strong>{formatPeriod(String(latest.period))}</strong>
            </p>
          </div>
          <div className="country-hero-side">
            <div>
              <p className="country-hero-stat-label">Previous</p>
              <p className="country-hero-stat-value">
                {formatValue(previousVal, topic)}
                {previous?.period && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      color: "var(--fg-3)",
                    }}
                  >
                    {formatPeriod(String(previous.period))}
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="country-hero-stat-label">Change</p>
              <p className="country-hero-stat-value">
                {deltaPct === null ? (
                  "—"
                ) : (
                  <span
                    className={
                      deltaPct > 0
                        ? "delta delta--up"
                        : deltaPct < 0
                          ? "delta delta--down"
                          : "delta delta--flat"
                    }
                    style={{ fontSize: 16 }}
                  >
                    {deltaPct > 0 ? "+" : ""}
                    {deltaPct.toFixed(2)}%
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="country-hero-stat-label">Observations</p>
              <p className="country-hero-stat-value">
                {uniqueSorted.length.toLocaleString()}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="err-section">
        <p className="err-section-label">Recent data</p>
        <h2 className="err-section-heading">
          Last {Math.min(20, uniqueSorted.length)} periods
        </h2>

        <div className="data-table-wrap" style={{ marginTop: 14 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th className="num">Value</th>
                <th className="num">vs Prev</th>
              </tr>
            </thead>
            <tbody>
              {uniqueSorted
                .slice(-20)
                .reverse()
                .map((d, i, arr) => {
                  const v = getVal(d);
                  const prev = arr[i + 1];
                  const prevV = prev ? getVal(prev) : null;
                  const diff =
                    v !== null && prevV !== null && prevV !== 0
                      ? ((v - prevV) / prevV) * 100
                      : null;
                  const isLatest = i === 0;
                  return (
                    <tr
                      key={String(d.period) + i}
                      className={isLatest ? "is-latest" : ""}
                    >
                      <td className="mono muted">
                        {formatPeriod(String(d.period))}
                      </td>
                      <td className={`num ${isLatest ? "accent" : ""}`}>
                        {formatValue(v, topic)}
                      </td>
                      <td className="num">
                        {diff === null ? (
                          <span className="delta delta--flat">—</span>
                        ) : (
                          <span
                            className={
                              diff > 0
                                ? "delta delta--up"
                                : diff < 0
                                  ? "delta delta--down"
                                  : "delta delta--flat"
                            }
                          >
                            {diff > 0 ? "+" : ""}
                            {diff.toFixed(2)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="api-panel">
        <div className="api-panel-header">
          <p className="api-panel-label">Get this via API</p>
          <h2 className="api-panel-title">
            Query {countryInfo.name} {topicLabel.toLowerCase()} programmatically
          </h2>
        </div>
        <div className="api-panel-body">
          <div className="code-block">
            <div className="code-block-header">
              <div className="code-block-dots" aria-hidden="true">
                <span className="code-block-dot" />
                <span className="code-block-dot" />
                <span className="code-block-dot" />
              </div>
              <span className="code-block-lang">Request &middot; cURL</span>
            </div>
            <pre className="code-block-body">{curlSnippet}</pre>
          </div>
        </div>
        <div className="api-panel-footer">
          <p className="api-panel-note">
            Free tier: 100 req/day &middot;{" "}
            <a href="https://eurostat.wageapi.com/docs">Docs</a>
            {" · "}
            <a href="https://eurostat.wageapi.com/docs#mcp">MCP server</a>
          </p>
          <div className="api-panel-actions">
            <a href="https://console.aethar.dev" className="btn-primary">
              Get API key
            </a>
          </div>
        </div>
      </section>

      <p className="source-note">
        <strong>Source:</strong> Eurostat via Aethar Eurostat API.{" "}
        {earliest?.period && (
          <>
            Range <strong>{formatPeriod(String(earliest.period))}</strong>
            {" \u2013 "}
            <strong>{formatPeriod(String(latest?.period))}</strong>.{" "}
          </>
        )}
        {generatedAt && (
          <>
            Last generated{" "}
            <strong>{new Date(generatedAt).toLocaleDateString("en-IE")}</strong>.
          </>
        )}
      </p>
    </article>
  );
}
