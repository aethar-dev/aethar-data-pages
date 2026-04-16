import Link from "next/link";
import type { Metadata } from "next";
import { ERROR_CATALOG, getErrorDoc } from "@/lib/errors";

export function generateStaticParams() {
  return ERROR_CATALOG.map((err) => ({ code: err.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const err = getErrorDoc(code);
  return {
    title: err ? `${err.code} — Aethar API Error Reference` : "Error not found",
    description: err?.description ?? "Error code not found.",
  };
}

function pillClass(status: number): string {
  if (status >= 500) return "http-pill http-pill--lg http-pill--5xx";
  if (status >= 400) return "http-pill http-pill--lg http-pill--4xx";
  return "http-pill http-pill--lg http-pill--2xx";
}

function detectLanguage(snippet: string): string {
  const trimmed = snippet.trim();
  if (trimmed.startsWith("curl") || trimmed.startsWith("GET") || trimmed.startsWith("POST") || trimmed.startsWith("PUT") || trimmed.startsWith("DELETE")) {
    return "HTTP";
  }
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return "JSON";
  }
  return "TEXT";
}

export default async function ErrorPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const err = getErrorDoc(code);

  if (!err) {
    return (
      <div className="err-notfound">
        <p className="err-crumbs">
          <Link href="/errors">Error codes</Link>
          <span className="err-crumbs-sep">/</span>
          <span className="err-crumbs-cat">{code}</span>
        </p>
        <h1>Error code not found</h1>
        <p>
          <code>{code}</code> is not a recognized Aethar error code. It may have been
          renamed or removed — browse the full catalog for a match.
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/errors" className="btn-primary">
            Browse all error codes
          </Link>
          <a href="mailto:support@aethar.dev" className="btn-secondary">
            Contact support
          </a>
        </div>
      </div>
    );
  }

  return (
    <article>
      <nav className="err-crumbs" aria-label="Breadcrumb">
        <Link href="/errors">Error codes</Link>
        <span className="err-crumbs-sep">/</span>
        <span className="err-crumbs-cat">{err.category}</span>
      </nav>

      <header className="err-head">
        <div className="err-head-meta">
          <span className={pillClass(err.httpStatus)}>HTTP {err.httpStatus}</span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: "var(--fg-3)",
            }}
          >
            {err.category}
          </span>
        </div>
        <h1 className="err-head-title">{err.code}</h1>
      </header>

      <p className="err-description">{err.description}</p>

      {err.example && (
        <section className="err-section">
          <div className="err-section-label">Example</div>
          <h2 className="err-section-heading">Request &amp; response</h2>

          <div className="code-block">
            <div className="code-block-header">
              <div className="code-block-dots" aria-hidden="true">
                <span className="code-block-dot" />
                <span className="code-block-dot" />
                <span className="code-block-dot" />
              </div>
              <span className="code-block-lang">Request &middot; {detectLanguage(err.example.request)}</span>
            </div>
            <pre className="code-block-body">{err.example.request}</pre>
          </div>

          <div className="code-block" style={{ marginTop: 14 }}>
            <div className="code-block-header">
              <div className="code-block-dots" aria-hidden="true">
                <span className="code-block-dot" />
                <span className="code-block-dot" />
                <span className="code-block-dot" />
              </div>
              <span className="code-block-lang">Response &middot; {detectLanguage(err.example.response)}</span>
            </div>
            <pre className="code-block-body">{err.example.response}</pre>
          </div>
        </section>
      )}

      {err.fixSteps && err.fixSteps.length > 0 && (
        <section className="err-section">
          <div className="err-section-label">Remediation</div>
          <h2 className="err-section-heading">How to fix</h2>
          <ol className="err-steps">
            {err.fixSteps.map((step, i) => (
              <li key={i} className="err-step">
                <StepText text={step} />
              </li>
            ))}
          </ol>
        </section>
      )}

      <aside className="err-cta">
        <p className="err-cta-label">Still stuck?</p>
        <p className="err-cta-title">Get help from the Aethar team</p>
        <p className="err-cta-body">
          Email{" "}
          <a href="mailto:support@aethar.dev">support@aethar.dev</a> with the{" "}
          <code>request_id</code> from the API response — we log every request
          server-side and can trace exactly what happened.
        </p>
        <div className="err-cta-actions">
          <a href="mailto:support@aethar.dev" className="btn-primary">
            Email support
          </a>
          <a href="https://status.aethar.dev" className="btn-secondary">
            Check status page
          </a>
        </div>
      </aside>
    </article>
  );
}

/**
 * Auto-wrap URLs and inline code markers in a fix step.
 * Very light — just makes URLs clickable and `backticks` render as code.
 */
function StepText({ text }: { text: string }) {
  // Split on backticks first, then scan each plain segment for URLs.
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }
        // Linkify URLs in this plain segment
        const urlRegex = /(https?:\/\/[^\s)]+)/g;
        const isUrl = (s: string) => /^https?:\/\//.test(s);
        const subs = part.split(urlRegex);
        return (
          <span key={i}>
            {subs.map((sub, j) =>
              isUrl(sub) ? (
                <a
                  key={j}
                  href={sub}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent)",
                    borderBottom: "1px solid rgba(0,254,39,0.3)",
                  }}
                >
                  {sub}
                </a>
              ) : (
                <span key={j}>{sub}</span>
              ),
            )}
          </span>
        );
      })}
    </>
  );
}
