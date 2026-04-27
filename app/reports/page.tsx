import type { Metadata } from "next";
import Link from "next/link";
import { readdirSync, statSync, readFileSync } from "fs";
import { join } from "path";

export const metadata: Metadata = {
  title: "Reports — Aethar Data",
  description:
    "Weekly EU economic data digests and snapshot reports. GDP, inflation, unemployment, and population trends across EU member states.",
  alternates: { canonical: "/reports" },
};

interface ReportEntry {
  slug: string;
  title: string;
  description: string;
  kind: "weekly" | "snapshot";
}

function listReports(): ReportEntry[] {
  const reportsDir = join(process.cwd(), "app", "reports");
  const entries: ReportEntry[] = [];

  for (const slug of readdirSync(reportsDir)) {
    const full = join(reportsDir, slug);
    if (!statSync(full).isDirectory()) continue;

    const pagePath = join(full, "page.tsx");
    let title = slug;
    let description = "";
    try {
      const src = readFileSync(pagePath, "utf-8");
      const titleMatch = src.match(/title:\s*"([^"]+)"/);
      const descMatch = src.match(/description:\s*\n?\s*"([^"]+)"/);
      if (titleMatch) title = titleMatch[1].replace(/ \| Aethar Data$/, "");
      if (descMatch) description = descMatch[1];
    } catch {
      continue;
    }

    entries.push({
      slug,
      title,
      description,
      kind: slug.startsWith("weekly-") ? "weekly" : "snapshot",
    });
  }

  // Sort newest first by slug (weekly-YYYY-wNN sorts naturally; snapshots fall after)
  return entries.sort((a, b) => b.slug.localeCompare(a.slug));
}

export default function ReportsIndex() {
  const reports = listReports();
  const weekly = reports.filter((r) => r.kind === "weekly");
  const snapshots = reports.filter((r) => r.kind === "snapshot");

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#4DD0E1]">
        Data Reports
      </p>
      <h1 className="mt-2 text-2xl font-light text-white">All Reports</h1>
      <p className="mt-3 text-sm text-[#8890AA]">
        Weekly EU economic digests auto-generated from live Eurostat data via
        Aethar APIs, plus periodic deep-dive snapshots.
      </p>

      {weekly.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-white">Weekly</h2>
          <ul className="mt-4 divide-y divide-[#2A2D3A]/50 border-y border-[#2A2D3A]/50">
            {weekly.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/reports/${r.slug}`}
                  className="block py-4 transition-colors hover:bg-[#4DD0E1]/5"
                >
                  <p className="text-sm font-medium text-white">{r.title}</p>
                  {r.description && (
                    <p className="mt-1 text-xs text-[#8890AA]">
                      {r.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {snapshots.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-white">Snapshots</h2>
          <ul className="mt-4 divide-y divide-[#2A2D3A]/50 border-y border-[#2A2D3A]/50">
            {snapshots.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/reports/${r.slug}`}
                  className="block py-4 transition-colors hover:bg-[#4DD0E1]/5"
                >
                  <p className="text-sm font-medium text-white">{r.title}</p>
                  {r.description && (
                    <p className="mt-1 text-xs text-[#8890AA]">
                      {r.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 rounded-lg border border-[#4DD0E1]/20 bg-[#4DD0E1]/5 p-8 text-center">
        <h2 className="text-lg font-light text-white">Get this data via API</h2>
        <p className="mt-2 text-sm text-[#8890AA]">
          All numbers in these reports come from EurostatAPI. Free tier: 100
          req/day.
        </p>
        <a
          href="https://console.aethar.dev"
          className="mt-4 inline-block rounded bg-[#4DD0E1] px-6 py-2.5 text-sm font-semibold text-[#0F1117]"
        >
          Get Free API Key
        </a>
      </div>
    </div>
  );
}
