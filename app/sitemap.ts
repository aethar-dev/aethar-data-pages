import { readdirSync, existsSync } from "fs";
import { join } from "path";
import type { MetadataRoute } from "next";
import { ERROR_CATALOG } from "@/lib/errors";

export const dynamic = "force-static";

const BASE = "https://data.aethar.dev";
const DATA_DIR = join(process.cwd(), "data", "generated");
const TOPICS = ["gdp", "inflation", "unemployment", "population"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const entries: MetadataRoute.Sitemap = [];

  // Homepage
  entries.push({ url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 });

  // Topic index pages
  for (const topic of TOPICS) {
    entries.push({ url: `${BASE}/${topic}`, lastModified: now, changeFrequency: "daily", priority: 0.9 });
  }

  // Topic country pages — discover from generated data
  for (const topic of TOPICS) {
    const dir = join(DATA_DIR, topic);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      const country = f.replace(".json", "");
      entries.push({ url: `${BASE}/${topic}/${country}`, lastModified: now, changeFrequency: "daily", priority: 0.8 });
    }
  }

  // Compare index
  entries.push({ url: `${BASE}/compare`, lastModified: now, changeFrequency: "daily", priority: 0.8 });

  // Compare pages — discover from generated data
  const compareDir = join(DATA_DIR, "compare");
  for (const topic of TOPICS) {
    const dir = join(compareDir, topic);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      const pair = f.replace(".json", "");
      entries.push({ url: `${BASE}/compare/${topic}/${pair}`, lastModified: now, changeFrequency: "daily", priority: 0.7 });
    }
  }

  // Errors index
  entries.push({ url: `${BASE}/errors`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });

  // Error pages
  for (const err of ERROR_CATALOG) {
    entries.push({ url: `${BASE}/errors/${err.code}`, lastModified: now, changeFrequency: "weekly", priority: 0.5 });
  }

  // Report pages — discover from filesystem
  const reportsDir = join(process.cwd(), "app", "reports");
  if (existsSync(reportsDir)) {
    for (const entry of readdirSync(reportsDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        entries.push({ url: `${BASE}/reports/${entry.name}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
      }
    }
  }

  return entries;
}
