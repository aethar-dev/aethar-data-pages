import { readdirSync } from "fs";
import { join } from "path";
import Link from "next/link";

const TOPICS = [
  { slug: "gdp", title: "GDP", description: "Quarterly Gross Domestic Product by country" },
  { slug: "inflation", title: "Inflation (HICP)", description: "Monthly harmonized consumer price index" },
  { slug: "unemployment", title: "Unemployment", description: "Monthly unemployment rates including youth" },
  { slug: "population", title: "Population", description: "Annual population on 1 January" },
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
  return (
    <div>
      <h1 className="text-3xl font-light text-white">EU Economic Data</h1>
      <p className="mt-3 text-sm text-[#8890AA]">
        Live statistics for {TOPICS.length} economic indicators across 27 EU member states.
        All data sourced from Eurostat, updated daily.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {TOPICS.map((t) => {
          const countries = getCountries(t.slug);
          return (
            <Link
              key={t.slug}
              href={`/${t.slug}`}
              className="rounded-lg border border-[#2A2D3A] bg-[#1C1F29] p-6 transition-colors hover:border-[#4DD0E1]/40"
            >
              <h2 className="text-lg font-semibold text-white">{t.title}</h2>
              <p className="mt-2 text-sm text-[#8890AA]">{t.description}</p>
              <p className="mt-3 text-xs text-[#4DD0E1]">{countries.length} countries</p>
            </Link>
          );
        })}
      </div>

      {/* Latest Report */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-white">Latest Report</h2>
        <Link
          href="/reports/eu-snapshot-april-2026"
          className="mt-4 block rounded-lg border border-[#4DD0E1]/30 bg-[#4DD0E1]/5 p-6 transition-colors hover:border-[#4DD0E1]/60"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#4DD0E1]">
            Weekly Data Report
          </p>
          <h3 className="mt-1 text-lg text-white">
            EU Economic Snapshot — April 2026
          </h3>
          <p className="mt-2 text-sm text-[#8890AA]">
            GDP growth divergence, inflation trends, unemployment comparison, and
            population changes across 14 EU economies.
          </p>
        </Link>
      </div>

      {/* API CTA */}
      <div className="mt-16 rounded-lg border border-[#4DD0E1]/20 bg-[#4DD0E1]/5 p-8 text-center">
        <h2 className="text-xl font-light text-white">Access this data via API</h2>
        <p className="mt-2 text-sm text-[#8890AA]">
          Clean JSON endpoints. No SDMX. Free tier with 100 requests/day.
        </p>
        <a
          href="https://console.aethar.dev"
          className="mt-4 inline-block rounded bg-[#4DD0E1] px-6 py-2.5 text-sm font-semibold text-[#0F1117] transition-colors hover:bg-[#4DD0E1]/90"
        >
          Get Free API Key
        </a>
      </div>
    </div>
  );
}
