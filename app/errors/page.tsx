import Link from "next/link";
import type { Metadata } from "next";
import { ERROR_CATALOG } from "@/lib/errors";

export const metadata: Metadata = {
  title: "Aethar API Errors — Reference",
  description: "Complete reference of error codes returned by Aethar APIs. Look up any error code to learn what went wrong and how to fix it.",
};

export default function ErrorsIndex() {
  // Group by category
  const byCategory = new Map<string, typeof ERROR_CATALOG>();
  for (const err of ERROR_CATALOG) {
    if (!byCategory.has(err.category)) byCategory.set(err.category, []);
    byCategory.get(err.category)!.push(err);
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#4DD0E1]">API Reference</p>
      <h1 className="mt-2 text-2xl font-light text-white">Error codes</h1>
      <p className="mt-3 text-sm text-[#8890AA]">
        Complete reference of {ERROR_CATALOG.length} error codes returned by Aethar APIs. Each code
        has a stable URL for deep-linking.
      </p>

      {Array.from(byCategory.entries()).map(([category, errors]) => (
        <div key={category} className="mt-10">
          <h2 className="text-lg font-semibold text-white">{category}</h2>
          <div className="mt-4 grid gap-2">
            {errors.map((err) => (
              <Link
                key={err.code}
                href={`/errors/${err.code}`}
                className="flex items-center gap-4 rounded border border-[#2A2D3A] bg-[#1C1F29] px-4 py-3 transition-colors hover:border-[#4DD0E1]/40"
              >
                <span className="flex-shrink-0 rounded bg-[#0F1117] px-2 py-0.5 font-mono text-xs text-orange-400">
                  {err.httpStatus}
                </span>
                <code className="flex-shrink-0 font-mono text-sm text-white">{err.code}</code>
                <span className="flex-1 truncate font-body text-sm text-[#8890AA]">{err.description}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
