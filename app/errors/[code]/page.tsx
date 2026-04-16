import Link from "next/link";
import type { Metadata } from "next";
import { ERROR_CATALOG, getErrorDoc } from "@/lib/errors";

export function generateStaticParams() {
  return ERROR_CATALOG.map((err) => ({ code: err.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const err = getErrorDoc(code);
  return {
    title: err ? `${err.code} — Aethar API Error Reference` : "Error not found",
    description: err?.description ?? "Error code not found.",
  };
}

export default async function ErrorPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const err = getErrorDoc(code);

  if (!err) {
    return (
      <div>
        <p className="text-xs text-[#8890AA]">
          <Link href="/errors" className="hover:text-white">Error codes</Link> / {code}
        </p>
        <h1 className="mt-2 text-2xl font-light text-white">Error code not found</h1>
        <p className="mt-3 text-sm text-[#8890AA]">
          <code className="font-mono text-[#4DD0E1]">{code}</code> is not a recognized Aethar error code.
        </p>
        <Link href="/errors" className="mt-6 inline-block rounded bg-[#4DD0E1] px-4 py-2 text-sm font-semibold text-[#0F1117]">
          Browse all error codes
        </Link>
      </div>
    );
  }

  const statusColor = err.httpStatus >= 500 ? "text-red-400" : err.httpStatus >= 400 ? "text-orange-400" : "text-[#4DD0E1]";

  return (
    <div>
      <p className="text-xs text-[#8890AA]">
        <Link href="/errors" className="hover:text-white">Error codes</Link>
        {" / "}
        <span className="text-[#4DD0E1]">{err.category}</span>
      </p>

      <div className="mt-3 flex items-center gap-3">
        <span className={`rounded bg-[#1C1F29] px-2 py-1 font-mono text-sm ${statusColor}`}>HTTP {err.httpStatus}</span>
        <h1 className="text-2xl font-light text-white font-mono">{err.code}</h1>
      </div>

      <p className="mt-6 text-base leading-relaxed text-[#E0E2EF]">{err.description}</p>

      {err.example && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#8890AA]">Example</h2>
          <div className="mt-3 space-y-3">
            <div>
              <p className="mb-1 font-mono text-xs text-[#8890AA]">Request</p>
              <pre className="overflow-x-auto rounded border border-[#2A2D3A] bg-[#1C1F29] p-4 font-mono text-xs text-[#E0E2EF]">{err.example.request}</pre>
            </div>
            <div>
              <p className="mb-1 font-mono text-xs text-[#8890AA]">Response</p>
              <pre className="overflow-x-auto rounded border border-[#2A2D3A] bg-[#1C1F29] p-4 font-mono text-xs text-[#E0E2EF]">{err.example.response}</pre>
            </div>
          </div>
        </div>
      )}

      {err.fixSteps && err.fixSteps.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#8890AA]">How to fix</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#E0E2EF]">
            {err.fixSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-12 rounded border border-[#4DD0E1]/20 bg-[#4DD0E1]/5 p-6">
        <p className="text-sm font-semibold text-white">Still stuck?</p>
        <p className="mt-2 text-sm text-[#8890AA]">
          Contact support at <a href="mailto:support@aethar.dev" className="text-[#4DD0E1] hover:underline">support@aethar.dev</a> with your{" "}
          <code className="font-mono text-xs text-[#4DD0E1]">request_id</code> — shown in the API response and in your console logs.
        </p>
      </div>
    </div>
  );
}
