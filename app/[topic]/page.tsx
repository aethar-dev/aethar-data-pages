import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import type { Metadata } from "next";

const TOPIC_META: Record<string, { title: string; unit: string; description: string }> = {
  gdp: { title: "GDP by Country", unit: "EUR (millions)", description: "Quarterly Gross Domestic Product across EU member states" },
  inflation: { title: "Inflation (HICP) by Country", unit: "Index (2015=100)", description: "Monthly harmonized index of consumer prices" },
  unemployment: { title: "Unemployment Rate by Country", unit: "%", description: "Monthly unemployment rates across EU member states" },
  population: { title: "Population by Country", unit: "persons", description: "Annual population on 1 January" },
};

export function generateStaticParams() {
  return Object.keys(TOPIC_META).map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
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
        return { code: raw.country.code, name: raw.country.name, count: Array.isArray(raw.data) ? raw.data.length : 0 };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const meta = TOPIC_META[topic];
  const countries = getCountryData(topic);

  if (!meta) return <p>Topic not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-light text-white">{meta.title}</h1>
      <p className="mt-2 text-sm text-[#8890AA]">{meta.description}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
          <Link
            key={c.code}
            href={`/${topic}/${c.code.toLowerCase()}`}
            className="flex items-center justify-between rounded border border-[#2A2D3A] bg-[#1C1F29] px-5 py-4 transition-colors hover:border-[#4DD0E1]/40"
          >
            <span className="text-sm font-medium text-white">{c.name}</span>
            <span className="text-xs text-[#8890AA]">{c.count} records</span>
          </Link>
        ))}
      </div>

      {countries.length === 0 && (
        <p className="mt-8 text-sm text-[#8890AA]">No data generated yet. Run: npm run generate</p>
      )}

      <div className="mt-12 rounded border border-[#2A2D3A] bg-[#1C1F29] p-5">
        <p className="text-xs text-[#8890AA]">
          API endpoint: <code className="text-[#4DD0E1]">GET /v1/{topic}?country=XX</code>
          {" · "}
          <a href="https://eurostat.wageapi.com/docs" className="text-[#4DD0E1] hover:underline">Full documentation</a>
        </p>
      </div>
    </div>
  );
}
