import { readdirSync, existsSync } from "fs";
import { join } from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { countryFlag } from "@/lib/countries";

export const metadata: Metadata = {
  title: "EU Country Comparisons — Aethar Data",
  description: "Compare GDP, inflation, unemployment, and population between EU countries. Side-by-side data powered by Eurostat via Aethar API.",
};

const TOPICS = [
  { slug: "gdp", label: "GDP" },
  { slug: "inflation", label: "Inflation" },
  { slug: "unemployment", label: "Unemployment" },
  { slug: "population", label: "Population" },
];

const DATA_DIR = join(process.cwd(), "data", "generated", "compare");

const COUNTRY_NAMES: Record<string, string> = {
  de: "Germany", fr: "France", pl: "Poland", it: "Italy", es: "Spain",
  nl: "Netherlands", se: "Sweden", at: "Austria", be: "Belgium", cz: "Czechia",
  dk: "Denmark", fi: "Finland", ie: "Ireland", pt: "Portugal",
};

function getPairs(topic: string): { slug: string; c1: string; c2: string }[] {
  const dir = join(DATA_DIR, topic);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const slug = f.replace(".json", "");
      const [c1, c2] = slug.split("-vs-");
      return { slug, c1, c2 };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export default function ComparisonsIndex() {
  return (
    <div>
      <p className="err-kicker">EU Data</p>
      <h1 className="err-h1">Country comparisons</h1>
      <p className="err-lede">
        Side-by-side economic data for top EU country pairs. Each comparison
        shows latest values, historical trends, and percentage differences.
      </p>

      {TOPICS.map((topic) => {
        const pairs = getPairs(topic.slug);
        if (pairs.length === 0) return null;
        return (
          <section key={topic.slug} className="err-category">
            <header className="err-category-header">
              <h2 className="err-category-title">{topic.label}</h2>
              <span className="err-category-count">
                {pairs.length.toString().padStart(2, "0")} pairs
              </span>
            </header>
            <div className="err-table" role="list">
              {pairs.map(({ slug, c1, c2 }) => (
                <Link
                  key={slug}
                  href={`/compare/${topic.slug}/${slug}`}
                  className="err-row"
                  role="listitem"
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, whiteSpace: "nowrap" }}>
                    {countryFlag(c1.toUpperCase())} {c1.toUpperCase()}
                  </span>
                  <span className="err-row-code">
                    {COUNTRY_NAMES[c1] ?? c1} vs {COUNTRY_NAMES[c2] ?? c2}
                  </span>
                  <span className="err-row-desc">
                    {countryFlag(c2.toUpperCase())} {c2.toUpperCase()} · {topic.label}
                  </span>
                  <span className="err-chev" aria-hidden="true">&rarr;</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
