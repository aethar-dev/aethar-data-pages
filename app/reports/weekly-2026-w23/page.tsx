import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU Economic Weekly — Week 23, June 2026",
  description: "Week 23 EU economic digest (2026-06-08 – 2026-06-14): GDP rankings, inflation trends, unemployment rates across EU member states. Data from Eurostat via Aethar APIs.",
  alternates: { canonical: "/reports/weekly-2026-w23" },
};

export default function WeeklyReport() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#4DD0E1]">Weekly Data Report · Week 23</p>
      <h1 className="mt-2 text-2xl font-light text-white">EU Economic Weekly — Week 23, June 2026</h1>
      <p className="mt-3 text-sm text-[#8890AA]">2026-06-08 – 2026-06-14 · auto-generated from live Eurostat data via Aethar APIs.</p>

      {/* GDP */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">GDP — Top 10 Economies</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Quarterly GDP in millions EUR (latest available)</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">GDP (M EUR)</th></tr></thead>
          <tbody>
              <tr key="DE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Germany</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">712,048</td>
              </tr>
              <tr key="FR" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">France</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">527,576.5</td>
              </tr>
              <tr key="IT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Italy</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">390,796</td>
              </tr>
              <tr key="ES" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Spain</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">272,019.3</td>
              </tr>
              <tr key="NL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Netherlands</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">168,467.1</td>
              </tr>
              <tr key="PL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Poland</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">105,743.6</td>
              </tr>
              <tr key="SE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Sweden</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">103,562.1</td>
              </tr>
              <tr key="BE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Belgium</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">96,178.4</td>
              </tr>
              <tr key="AT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Austria</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">77,761.9</td>
              </tr>
              <tr key="DK" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Denmark</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">64,754.9</td>
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
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">102.7</td>
              </tr>
              <tr key="CY" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Cyprus</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">101.4</td>
              </tr>
              <tr key="HR" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Croatia</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">101.0</td>
              </tr>
              <tr key="DE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Germany</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.8</td>
              </tr>
              <tr key="IE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Ireland</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.8</td>
              </tr>
              <tr key="BE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Belgium</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.6</td>
              </tr>
              <tr key="NL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Netherlands</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.6</td>
              </tr>
              <tr key="LU" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Luxembourg</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.5</td>
              </tr>
              <tr key="BG" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Bulgaria</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.4</td>
              </tr>
              <tr key="EE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Estonia</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.4</td>
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
              <tr key="DE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Germany</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">4.2%</td>
              </tr>
              <tr key="CZ" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Czechia</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">4.7%</td>
              </tr>
              <tr key="MT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Malta</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">5.4%</td>
              </tr>
              <tr key="AT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Austria</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">6.0%</td>
              </tr>
              <tr key="HU" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Hungary</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">6.0%</td>
              </tr>
              <tr key="DK" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Denmark</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">6.2%</td>
              </tr>
              <tr key="EE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Estonia</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">6.2%</td>
              </tr>
              <tr key="LU" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Luxembourg</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">6.5%</td>
              </tr>
              <tr key="PL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Poland</td>
                <td className="py-2 text-right font-mono text-sm text-red-400">7.3%</td>
              </tr>
              <tr key="SE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Sweden</td>
                <td className="py-2 text-right font-mono text-sm text-red-400">7.3%</td>
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
