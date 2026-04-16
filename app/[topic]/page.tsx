import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { countryFlag } from "@/lib/countries";

const TOPIC_META: Record<
  string,
  { title: string; unit: string; description: string; frequency: string }
> = {
  gdp: {
    title: "GDP by country",
    unit: "EUR (millions, chain-linked 2010 prices)",
    description:
      "Quarterly Gross Domestic Product across EU member states, in chain-linked volumes.",
    frequency: "Quarterly",
  },
  inflation: {
    title: "Inflation (HICP) by country",
    unit: "Index (2015 = 100)",
    description:
      "Monthly harmonised index of consumer prices — the ECB's canonical inflation measure.",
    frequency: "Monthly",
  },
  unemployment: {
    title: "Unemployment rate by country",
    unit: "% of labour force",
    description:
      "Seasonally adjusted monthly unemployment rates across EU member states.",
    frequency: "Monthly",
  },
  population: {
    title: "Population by country",
    unit: "Persons",
    description: "Annual population estimates on 1 January for each EU member state.",
    frequency: "Annual",
  },
};

export function generateStaticParams() {
  return Object.keys(TOPIC_META).map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const meta = TOPIC_META[topic];
  return {
    title: meta ? `${meta.title} — EU Data` : "EU Data",
    description: meta?.description,
  };
}

function getCountryData(topic: string) {
  try {
    const dir = join(process.cwd(), "data", "generated", topic);
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const raw = JSON.parse(readFileSync(join(dir, f), "utf-8"));
        const obs = raw?.data?.observations;
        const fallback = Array.isArray(raw?.data) ? raw.data : [];
        const count = Array.isArray(obs) ? obs.length : fallback.length;
        return {
          code: raw.country.code as string,
          name: raw.country.name as string,
          count,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const meta = TOPIC_META[topic];
  const countries = getCountryData(topic);

  if (!meta) {
    return (
      <div className="err-notfound">
        <p className="err-crumbs">
          <Link href="/">Home</Link>
          <span className="err-crumbs-sep">/</span>
          <span className="err-crumbs-cat">{topic}</span>
        </p>
        <h1>Topic not found</h1>
        <p>
          <code>{topic}</code> is not a recognised dataset. Try one of the
          indicators in the navigation above.
        </p>
      </div>
    );
  }

  return (
    <div>
      <nav className="err-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="err-crumbs-sep">/</span>
        <span className="err-crumbs-cat">{topic}</span>
      </nav>

      <p className="err-kicker" style={{ marginTop: 18 }}>
        {meta.frequency} &middot; {meta.unit}
      </p>
      <h1 className="err-h1">{meta.title}</h1>
      <p className="err-lede">{meta.description}</p>

      <div className="topic-endpoint-hint">
        <span className="method">GET</span>
        <span className="path">
          /v1/{topic}?country=<em style={{ fontStyle: "normal", color: "var(--fg-3)" }}>XX</em>
        </span>
        <span aria-hidden="true" style={{ color: "var(--fg-3)" }}>
          &middot;
        </span>
        <a href="https://eurostat.wageapi.com/docs">Full documentation</a>
      </div>

      {countries.length === 0 ? (
        <p className="source-note" style={{ marginTop: 40 }}>
          No data generated yet. Run <strong>npm run generate</strong> locally to
          build the dataset.
        </p>
      ) : (
        <div className="country-grid">
          {countries.map((c) => (
            <Link
              key={c.code}
              href={`/${topic}/${c.code.toLowerCase()}`}
              className="country-card"
              aria-label={`${c.name} — ${c.count} records`}
            >
              <span className="country-card-flag" aria-hidden="true">
                {countryFlag(c.code)}
              </span>
              <span className="country-card-body">
                <span className="country-card-name">{c.name}</span>
                <span className="country-card-meta">
                  {c.count.toLocaleString()} records
                </span>
              </span>
              <span className="country-card-code">{c.code}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
