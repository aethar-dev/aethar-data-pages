import Link from "next/link";
import type { Metadata } from "next";
import { ERROR_CATALOG, type ErrorDoc } from "@/lib/errors";

export const metadata: Metadata = {
  title: "Aethar API Errors — Reference",
  description:
    "Complete reference of error codes returned by Aethar APIs. Look up any error code to learn what went wrong and how to fix it.",
};

function pillClass(status: number): string {
  if (status >= 500) return "http-pill http-pill--5xx";
  if (status >= 400) return "http-pill http-pill--4xx";
  return "http-pill http-pill--2xx";
}

export default function ErrorsIndex() {
  // Group by category (preserve catalog order)
  const byCategory = new Map<string, ErrorDoc[]>();
  for (const err of ERROR_CATALOG) {
    if (!byCategory.has(err.category)) byCategory.set(err.category, []);
    byCategory.get(err.category)!.push(err);
  }

  const total = ERROR_CATALOG.length;
  const categoryCount = byCategory.size;
  const httpStatuses = new Set(ERROR_CATALOG.map((e) => e.httpStatus)).size;

  return (
    <div>
      <p className="err-kicker">API Reference</p>
      <h1 className="err-h1">Error codes</h1>
      <p className="err-lede">
        Every error returned by the Aethar API suite, documented with a stable URL.
        Deep-link any code from logs, Sentry, or your agent runtime straight to
        this reference. Each page includes an example payload and recovery steps.
      </p>

      <div className="err-stat-row" role="list">
        <div className="err-stat" role="listitem">
          <div className="err-stat-value">{total}</div>
          <div className="err-stat-label">Codes</div>
        </div>
        <div className="err-stat" role="listitem">
          <div className="err-stat-value">{categoryCount}</div>
          <div className="err-stat-label">Categories</div>
        </div>
        <div className="err-stat" role="listitem">
          <div className="err-stat-value">{httpStatuses}</div>
          <div className="err-stat-label">HTTP statuses</div>
        </div>
      </div>

      {Array.from(byCategory.entries()).map(([category, errors]) => (
        <section key={category} className="err-category">
          <header className="err-category-header">
            <h2 className="err-category-title">{category}</h2>
            <span className="err-category-count">
              {errors.length.toString().padStart(2, "0")} {errors.length === 1 ? "code" : "codes"}
            </span>
          </header>
          <div className="err-table" role="list">
            {errors.map((err) => (
              <Link
                key={err.code}
                href={`/errors/${err.code}`}
                className="err-row"
                role="listitem"
                aria-label={`${err.code} — HTTP ${err.httpStatus}`}
              >
                <span className={pillClass(err.httpStatus)}>{err.httpStatus}</span>
                <code className="err-row-code">{err.code}</code>
                <span className="err-row-desc">{err.description}</span>
                <span className="err-chev" aria-hidden="true">&rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
