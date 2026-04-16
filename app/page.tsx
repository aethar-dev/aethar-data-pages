import { readdirSync } from "fs";
import { join } from "path";
import Link from "next/link";

const TOPICS = [
  {
    slug: "gdp",
    title: "GDP",
    description: "Quarterly Gross Domestic Product by EU member state.",
    endpoint: "GET /v1/gdp",
  },
  {
    slug: "inflation",
    title: "Inflation (HICP)",
    description: "Monthly harmonised index of consumer prices.",
    endpoint: "GET /v1/inflation",
  },
  {
    slug: "unemployment",
    title: "Unemployment",
    description: "Monthly unemployment rates including youth.",
    endpoint: "GET /v1/unemployment",
  },
  {
    slug: "population",
    title: "Population",
    description: "Annual population estimates on 1 January.",
    endpoint: "GET /v1/population",
  },
];

function getCountries(topic: string): string[] {
  try {
    const dir = join(process.cwd(), "data", "generated", topic);
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", "").toUpperCase());
  } catch {
    return [];
  }
}

export default function HomePage() {
  const totalCountries = new Set(
    TOPICS.flatMap((t) => getCountries(t.slug)),
  ).size;

  return (
    <div>
      <p className="err-kicker">Eurostat Reference</p>
      <h1 className="err-h1">EU economic data</h1>
      <p className="err-lede">
        Clean, deep-linkable statistics for GDP, inflation, unemployment, and
        population across EU member states. Sourced from Eurostat via the
        <code> Aethar Eurostat API</code>, updated daily, free to browse, free
        to query.
      </p>

      <div className="home-hero-meta">
        <span className="home-hero-meta-item">
          <strong>{TOPICS.length}</strong> indicators
        </span>
        <span className="home-hero-meta-item">
          <strong>{totalCountries}</strong> countries tracked
        </span>
        <span className="home-hero-meta-item">
          <strong>JSON</strong> over REST &amp; MCP
        </span>
        <span className="home-hero-meta-item">
          Updated <strong>daily</strong>
        </span>
      </div>

      <div className="topic-grid">
        {TOPICS.map((t) => {
          const countries = getCountries(t.slug);
          return (
            <Link key={t.slug} href={`/${t.slug}`} className="topic-card">
              <div className="topic-card-header">
                <h2 className="topic-card-title">{t.title}</h2>
                <span className="topic-card-count">
                  {countries.length.toString().padStart(2, "0")} countries
                </span>
              </div>
              <p className="topic-card-desc">{t.description}</p>
              <div className="topic-card-footer">
                <code className="topic-card-endpoint">{t.endpoint}</code>
                <span className="topic-card-chev" aria-hidden="true">
                  &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="report-feature">
        <p className="err-section-label">Latest report</p>
        <Link
          href="/reports/eu-snapshot-april-2026"
          className="report-feature-card"
        >
          <p className="err-cta-label">Weekly data report</p>
          <h3 className="report-feature-title">
            EU Economic Snapshot &mdash; April 2026
          </h3>
          <p className="report-feature-body">
            GDP growth divergence, inflation trends, unemployment comparison,
            and population changes across 14 EU economies.
          </p>
          <p className="report-feature-meta">
            Published 13 April 2026 &middot; 14 countries &middot; 4 indicators
          </p>
        </Link>
      </section>

      <aside className="err-cta">
        <p className="err-cta-label">API access</p>
        <p className="err-cta-title">Build on EU data with clean JSON</p>
        <p className="err-cta-body">
          Skip the SDMX. Every number on this site is available via a single
          REST endpoint, with a free tier of 100 requests/day and MCP support
          for agent runtimes.
        </p>
        <div className="err-cta-actions">
          <a href="https://console.aethar.dev" className="btn-primary">
            Get free API key
          </a>
          <a
            href="https://eurostat.wageapi.com/docs"
            className="btn-secondary"
          >
            Read the docs
          </a>
        </div>
      </aside>
    </div>
  );
}
