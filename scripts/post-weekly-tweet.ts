/**
 * Auto-post weekly EU economic report to @aethardev on X.
 *
 * Runs from GH Actions on Mondays (after the cron generates fresh data).
 * Uses OAuth 1.0a User Context — required for v2 POST /2/tweets.
 *
 * Required env: X_CONSUMER_KEY, X_CONSUMER_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET.
 * Free tier: 1500 POSTs/month, this uses ~4/month.
 */

import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { createHmac, randomBytes } from "crypto";

const DATA_DIR = join(__dirname, "..", "data", "generated");
const SITE_BASE = "https://data.aethar.dev";

interface Observation {
  period?: string;
  value?: number;
  rate?: number;
  population?: number;
  index_value?: number;
}

interface CountryData {
  country: { code: string; name: string };
  data: { observations?: Observation[] };
}

function loadTopicData(topic: string): CountryData[] {
  const dir = join(DATA_DIR, topic);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf-8")));
}

function getVal(o: Observation): number {
  return o.value ?? o.rate ?? o.population ?? o.index_value ?? 0;
}

function latest(c: CountryData): number {
  const obs = c.data.observations ?? [];
  if (obs.length === 0) return 0;
  // Pick the most recent non-zero observation by period
  const sorted = [...obs].sort((a, b) => (b.period ?? "").localeCompare(a.period ?? ""));
  for (const o of sorted) {
    const v = getVal(o);
    if (v !== 0) return v;
  }
  return 0;
}

function getWeekNumber(): number {
  const d = new Date();
  return Math.ceil(((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7);
}

function getWeekSlug(): string {
  return `${new Date().getFullYear()}-w${String(getWeekNumber()).padStart(2, "0")}`;
}

interface Insights {
  gdpTop3: { name: string; v: number }[];
  lowestUnemp: { name: string; v: number } | null;
  highestInfl: { name: string; v: number } | null;
}

function buildInsights(): Insights {
  const gdp = loadTopicData("gdp")
    .map((c) => ({ name: c.country.name, v: latest(c) }))
    .sort((a, b) => b.v - a.v);
  const unemployment = loadTopicData("unemployment")
    .map((c) => ({ name: c.country.name, v: latest(c) }))
    .filter((c) => c.v > 0)
    .sort((a, b) => a.v - b.v);
  const inflation = loadTopicData("inflation")
    .map((c) => ({ name: c.country.name, v: latest(c) }))
    .sort((a, b) => b.v - a.v);

  return {
    gdpTop3: gdp.slice(0, 3),
    lowestUnemp: unemployment[0] ?? null,
    highestInfl: inflation[0] ?? null,
  };
}

function buildTweet(insights: Insights): string {
  const week = getWeekNumber();
  const slug = getWeekSlug();
  const top3 = insights.gdpTop3.map((c) => c.name).join(" · ");

  const lines = [
    `EU Economic Weekly — Week ${week}`,
    ``,
    `GDP top 3: ${top3}`,
    insights.lowestUnemp
      ? `Lowest unemployment: ${insights.lowestUnemp.name} (${insights.lowestUnemp.v.toFixed(1)}%)`
      : "",
    insights.highestInfl
      ? `Highest inflation: ${insights.highestInfl.name} (HICP ${insights.highestInfl.v.toFixed(1)})`
      : "",
    ``,
    `Full report → ${SITE_BASE}/reports/weekly-${slug}`,
  ].filter(Boolean);

  return lines.join("\n");
}

// ──────────────────────────────────────────────────────────────────
// Sanity checks — abort if numbers look like the data pipeline broke.
// ──────────────────────────────────────────────────────────────────

function sanityCheck(insights: Insights, tweet: string): string[] {
  const errors: string[] = [];
  const ANCHOR_GDP = ["Germany", "France", "Italy", "Spain"];

  if (insights.gdpTop3.length < 3) {
    errors.push(`GDP ranking has only ${insights.gdpTop3.length} entries (expected ≥ 3)`);
  }
  if (insights.gdpTop3.some((c) => c.v <= 0)) {
    errors.push(`Zero/negative value in GDP top 3 — data loader likely broken`);
  }
  if (!insights.gdpTop3.some((c) => ANCHOR_GDP.includes(c.name))) {
    errors.push(
      `GDP top 3 (${insights.gdpTop3.map((c) => c.name).join(", ")}) contains none of {${ANCHOR_GDP.join(", ")}} — ` +
        `EU's largest economies should always rank here`,
    );
  }

  if (!insights.lowestUnemp) {
    errors.push(`Missing unemployment data`);
  } else if (insights.lowestUnemp.v < 0.5 || insights.lowestUnemp.v > 25) {
    errors.push(
      `Lowest unemployment ${insights.lowestUnemp.v.toFixed(1)}% outside plausible 0.5-25% range`,
    );
  }

  if (!insights.highestInfl) {
    errors.push(`Missing inflation data`);
  } else if (insights.highestInfl.v < 90 || insights.highestInfl.v > 250) {
    errors.push(
      `Highest HICP ${insights.highestInfl.v.toFixed(1)} outside plausible 90-250 range (2015=100 base)`,
    );
  }

  if (tweet.length < 100) errors.push(`Tweet body suspiciously short (${tweet.length} chars)`);
  if (tweet.length > 280) errors.push(`Tweet body exceeds 280-char limit (${tweet.length})`);

  return errors;
}

// ──────────────────────────────────────────────────────────────────
// OAuth 1.0a signing for X v2 POST /2/tweets
// ──────────────────────────────────────────────────────────────────

function percentEncode(s: string): string {
  return encodeURIComponent(s).replace(/[!*'()]/g, (c) =>
    "%" + c.charCodeAt(0).toString(16).toUpperCase(),
  );
}

function buildAuthHeader(method: string, url: string): string {
  const consumerKey = process.env.X_CONSUMER_KEY!;
  const consumerSecret = process.env.X_CONSUMER_SECRET!;
  const accessToken = process.env.X_ACCESS_TOKEN!;
  const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET!;

  if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
    throw new Error("Missing X_* environment variables.");
  }

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`)
    .join("&");

  const baseString = [method.toUpperCase(), percentEncode(url), percentEncode(paramString)].join("&");

  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(accessTokenSecret)}`;
  const signature = createHmac("sha1", signingKey).update(baseString).digest("base64");

  oauthParams.oauth_signature = signature;

  return (
    "OAuth " +
    Object.keys(oauthParams)
      .sort()
      .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
      .join(", ")
  );
}

async function postTweet(text: string): Promise<void> {
  const url = "https://api.x.com/2/tweets";
  const auth = buildAuthHeader("POST", url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const body = await response.text();
  if (!response.ok) {
    console.error(`X API error ${response.status}: ${body}`);
    process.exit(1);
  }
  console.log(`Tweet posted: ${body}`);
}

async function main() {
  const insights = buildInsights();
  const text = buildTweet(insights);
  console.log("Tweet body:");
  console.log(text);
  console.log(`\nLength: ${text.length} chars (limit 280)`);

  const errors = sanityCheck(insights, text);
  if (errors.length > 0) {
    console.error("\n[SANITY FAIL] aborting before post:");
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }
  console.log("[SANITY OK] all checks passed.");

  if (process.env.DRY_RUN === "true") {
    console.log("DRY_RUN=true — not posting.");
    return;
  }

  await postTweet(text);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
