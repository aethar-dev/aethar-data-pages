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

function buildTweet(): string {
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

  const week = getWeekNumber();
  const slug = getWeekSlug();
  const top3 = gdp.slice(0, 3).map((c) => c.name).join(" · ");
  const lowestUnemp = unemployment[0];
  const highestInfl = inflation[0];

  const lines = [
    `EU Economic Weekly — Week ${week}`,
    ``,
    `GDP top 3: ${top3}`,
    lowestUnemp ? `Lowest unemployment: ${lowestUnemp.name} (${lowestUnemp.v.toFixed(1)}%)` : "",
    highestInfl ? `Highest inflation: ${highestInfl.name} (HICP ${highestInfl.v.toFixed(1)})` : "",
    ``,
    `Full report → ${SITE_BASE}/reports/weekly-${slug}`,
  ].filter(Boolean);

  return lines.join("\n");
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
  const text = buildTweet();
  console.log("Tweet body:");
  console.log(text);
  console.log(`\nLength: ${text.length} chars (limit 280)`);

  if (text.length > 280) {
    console.error("Tweet too long.");
    process.exit(1);
  }

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
