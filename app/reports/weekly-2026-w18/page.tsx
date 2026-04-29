import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU Economic Weekly — Week 18, April 2026",
  description: "Week 18 EU economic digest (2026-04-27 – 2026-05-03): GDP rankings, inflation trends, unemployment rates across EU member states. Data from Eurostat via Aethar APIs.",
  alternates: { canonical: "/reports/weekly-2026-w18" },
};

export default function WeeklyReport() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#4DD0E1]">Weekly Data Report · Week 18</p>
      <h1 className="mt-2 text-2xl font-light text-white">EU Economic Weekly — Week 18, April 2026</h1>
      <p className="mt-3 text-sm text-[#8890AA]">2026-04-27 – 2026-05-03 · auto-generated from live Eurostat data via Aethar APIs.</p>

      {/* GDP */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">GDP — Top 10 Economies</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Quarterly GDP in millions EUR (latest available)</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">GDP (M EUR)</th></tr></thead>
          <tbody>
              <tr key="DE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Germany</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">723,601.4</td>
              </tr>
              <tr key="FR" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">France</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">529,577.7</td>
              </tr>
              <tr key="IT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Italy</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">394,668.8</td>
              </tr>
              <tr key="ES" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Spain</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">277,269.6</td>
              </tr>
              <tr key="NL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Netherlands</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">171,272.2</td>
              </tr>
              <tr key="PL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Poland</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">108,020.6</td>
              </tr>
              <tr key="SE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Sweden</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">105,032.9</td>
              </tr>
              <tr key="BE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Belgium</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">97,197.7</td>
              </tr>
              <tr key="AT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Austria</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">78,924</td>
              </tr>
              <tr key="DK" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Denmark</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">66,447.8</td>
              </tr>
          </tbody>
        </table>
      </div>

      {/* Inflation */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Inflation (HICP Index)</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Latest harmonized index value (2015=100)</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">HICP Index</th></tr></thead>
          <tbody>
              <tr key="MT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Malta</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">102.2</td>
              </tr>
              <tr key="BE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Belgium</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">102.0</td>
              </tr>
              <tr key="PT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Portugal</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">101.3</td>
              </tr>
              <tr key="LT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Lithuania</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">101.1</td>
              </tr>
              <tr key="SE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Sweden</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">101.1</td>
              </tr>
              <tr key="AT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Austria</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">101.0</td>
              </tr>
              <tr key="EE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Estonia</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.9</td>
              </tr>
              <tr key="NL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Netherlands</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.8</td>
              </tr>
              <tr key="HU" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Hungary</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.7</td>
              </tr>
              <tr key="FR" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">France</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.7</td>
              </tr>
          </tbody>
        </table>
      </div>

      {/* Unemployment */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Unemployment — Lowest Rates</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Latest monthly unemployment rate</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">Rate</th></tr></thead>
          <tbody>
              <tr key="CZ" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Czechia</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">2.9%</td>
              </tr>
              <tr key="DE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Germany</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">3.6%</td>
              </tr>
              <tr key="MT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Malta</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">3.9%</td>
              </tr>
              <tr key="HU" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Hungary</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">4.2%</td>
              </tr>
              <tr key="PL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Poland</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">5.2%</td>
              </tr>
              <tr key="LU" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Luxembourg</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">5.5%</td>
              </tr>
              <tr key="DK" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Denmark</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">5.9%</td>
              </tr>
              <tr key="AT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Austria</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">6.1%</td>
              </tr>
              <tr key="NL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Netherlands</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">6.1%</td>
              </tr>
              <tr key="RO" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Romania</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">6.3%</td>
              </tr>
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-lg border border-[#4DD0E1]/20 bg-[#4DD0E1]/5 p-8 text-center">
        <h2 className="text-lg font-light text-white">Get this data via API</h2>
        <p className="mt-2 text-sm text-[#8890AA]">All data in this report is available through EurostatAPI. Free tier: 100 req/day.</p>
        <a href="https://console.aethar.dev" className="mt-4 inline-block rounded bg-[#4DD0E1] px-6 py-2.5 text-sm font-semibold text-[#0F1117]">Get Free API Key</a>
      </div>

      <p className="mt-8 text-[10px] text-[#8890AA]">Data sourced from Eurostat via Aethar EurostatAPI. Auto-generated report.</p>
    </div>
  );
}
