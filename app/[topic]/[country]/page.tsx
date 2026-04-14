import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";

const TOPIC_LABELS: Record<string, string> = {
  gdp: "GDP",
  inflation: "Inflation (HICP)",
  unemployment: "Unemployment Rate",
  population: "Population",
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

export async function generateMetadata({ params }: { params: Promise<{ topic: string; country: string }> }): Promise<Metadata> {
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

export default async function CountryDataPage({ params }: { params: Promise<{ topic: string; country: string }> }) {
  const { topic, country } = await params;
  const pageData = loadData(topic, country);
  const topicLabel = TOPIC_LABELS[topic] ?? topic;

  if (!pageData) {
    return <p className="text-[#8890AA]">No data available for this country.</p>;
  }

  const countryInfo = pageData.country;
  const records = Array.isArray(pageData.data) ? pageData.data : [];
  const latest = records[records.length - 1];
  const generatedAt = pageData.generatedAt;

  // Extract value field (different per topic)
  const getVal = (d: Record<string, unknown>) =>
    (d.value ?? d.rate ?? d.population ?? d.index_value ?? 0) as number;

  return (
    <div>
      <p className="text-xs text-[#8890AA]">
        <a href={`/${topic}`} className="hover:text-white">{topicLabel}</a> / {countryInfo.name}
      </p>
      <h1 className="mt-2 text-2xl font-light text-white">
        {countryInfo.name} — {topicLabel}
      </h1>

      {/* Latest value highlight */}
      {latest && (
        <div className="mt-6 rounded-lg border border-[#4DD0E1]/20 bg-[#4DD0E1]/5 p-6">
          <p className="text-xs uppercase tracking-widest text-[#8890AA]">Latest ({latest.period})</p>
          <p className="mt-1 text-3xl font-light text-[#4DD0E1]">
            {typeof getVal(latest) === "number" ? getVal(latest).toLocaleString() : "—"}
          </p>
        </div>
      )}

      {/* Data table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]">
              <th className="py-2 pr-4">Period</th>
              <th className="py-2 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(-20).reverse().map((d: Record<string, unknown>, i: number) => (
              <tr key={i} className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 font-mono text-xs text-[#E0E2EF]">{String(d.period)}</td>
                <td className="py-2 text-right font-mono text-xs text-[#E0E2EF]">
                  {typeof getVal(d) === "number" ? getVal(d).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* API CTA */}
      <div className="mt-10 rounded border border-[#2A2D3A] bg-[#1C1F29] p-5">
        <p className="text-sm text-white">Get this data via API</p>
        <code className="mt-2 block rounded bg-[#0F1117] p-3 font-mono text-xs text-[#4DD0E1]">
          GET /v1/{topic}?country={countryInfo.code}
        </code>
        <p className="mt-3 text-xs text-[#8890AA]">
          Free tier: 100 requests/day.{" "}
          <a href="https://console.aethar.dev" className="text-[#4DD0E1] hover:underline">Get API Key</a>
          {" · "}
          <a href="https://eurostat.wageapi.com/docs" className="text-[#4DD0E1] hover:underline">Documentation</a>
        </p>
      </div>

      <p className="mt-6 text-[10px] text-[#8890AA]">
        Data sourced from Eurostat. Last generated: {new Date(generatedAt).toLocaleDateString()}.
      </p>
    </div>
  );
}
