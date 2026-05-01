import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU Economic Monthly — May 2026",
  description: "May 2026 EU economic digest with year-over-year context: GDP top 10, inflation rankings, unemployment rates, and population trends across all 27 EU member states. Data from Eurostat via Aethar APIs.",
  alternates: { canonical: "/reports/monthly-2026-05" },
};

export default function MonthlyReport() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#4DD0E1]">Monthly Data Report</p>
      <h1 className="mt-2 text-2xl font-light text-white">EU Economic Monthly — May 2026</h1>
      <p className="mt-3 text-sm text-[#8890AA]">Auto-generated from live Eurostat data via Aethar APIs. YoY column shows percent change vs the same period one year earlier.</p>

      {/* GDP */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">GDP — Top 10 Economies</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Quarterly GDP in millions EUR (latest available)</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">GDP (M EUR)</th><th className="py-2 pl-4 text-right">YoY</th></tr></thead>
          <tbody>
              <tr key="DE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Germany</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">723,601.4</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.1%</span></td>
              </tr>
              <tr key="FR" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">France</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">529,577.7</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.1%</span></td>
              </tr>
              <tr key="IT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Italy</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">394,668.8</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.5%</span></td>
              </tr>
              <tr key="ES" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Spain</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">277,269.6</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.0%</span></td>
              </tr>
              <tr key="NL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Netherlands</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">171,272.2</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.4%</span></td>
              </tr>
              <tr key="PL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Poland</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">108,020.6</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.3%</span></td>
              </tr>
              <tr key="SE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Sweden</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">105,032.9</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.4%</span></td>
              </tr>
              <tr key="BE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Belgium</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">97,197.7</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.7%</span></td>
              </tr>
              <tr key="AT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Austria</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">78,924</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.1%</span></td>
              </tr>
              <tr key="DK" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Denmark</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">66,447.8</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+2.3%</span></td>
              </tr>
          </tbody>
        </table>
      </div>

      {/* Inflation */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Inflation — Highest HICP</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Latest harmonized index of consumer prices (2015 = 100)</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">HICP Index</th><th className="py-2 pl-4 text-right">YoY</th></tr></thead>
          <tbody>
              <tr key="MT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Malta</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">102.2</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+3.7%</span></td>
              </tr>
              <tr key="BE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Belgium</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">102.0</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.3%</span></td>
              </tr>
              <tr key="PT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Portugal</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">101.3</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.5%</span></td>
              </tr>
              <tr key="LT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Lithuania</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">101.1</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.2%</span></td>
              </tr>
              <tr key="SE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Sweden</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">101.1</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.5%</span></td>
              </tr>
              <tr key="AT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Austria</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">101.0</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.1%</span></td>
              </tr>
              <tr key="EE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Estonia</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.9</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.9%</span></td>
              </tr>
              <tr key="NL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Netherlands</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.8</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.2%</span></td>
              </tr>
              <tr key="HU" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Hungary</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.7</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.0%</span></td>
              </tr>
              <tr key="FR" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">France</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">100.7</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.6%</span></td>
              </tr>
          </tbody>
        </table>
      </div>

      {/* Unemployment */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Unemployment — Lowest Rates</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Latest monthly unemployment rate</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">Rate</th><th className="py-2 pl-4 text-right">YoY</th></tr></thead>
          <tbody>
              <tr key="CZ" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Czechia</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">3.4%</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-green-400">-5.6%</span></td>
              </tr>
              <tr key="DE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Germany</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">3.6%</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-green-400">-2.7%</span></td>
              </tr>
              <tr key="MT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Malta</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">3.9%</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-green-400">-7.1%</span></td>
              </tr>
              <tr key="HU" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Hungary</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">4.4%</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+4.8%</span></td>
              </tr>
              <tr key="PL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Poland</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">5.2%</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-green-400">-5.5%</span></td>
              </tr>
              <tr key="LU" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Luxembourg</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">5.6%</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-green-400">-11.1%</span></td>
              </tr>
              <tr key="DK" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Denmark</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">5.9%</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+5.4%</span></td>
              </tr>
              <tr key="AT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Austria</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">6.0%</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-green-400">0.0%</span></td>
              </tr>
              <tr key="RO" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Romania</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">6.0%</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-green-400">-10.4%</span></td>
              </tr>
              <tr key="EE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Estonia</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">6.1%</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-green-400">-4.7%</span></td>
              </tr>
          </tbody>
        </table>
      </div>

      {/* Population */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Population — Most Populous</h2>
        <p className="mt-1 text-xs text-[#8890AA]">Total population (latest available)</p>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b border-[#2A2D3A] text-left text-xs text-[#8890AA]"><th className="py-2 pr-4">Country</th><th className="py-2 text-right">Population</th><th className="py-2 pl-4 text-right">YoY</th></tr></thead>
          <tbody>
              <tr key="DE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Germany</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">83,577,140</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.1%</span></td>
              </tr>
              <tr key="FR" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">France</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">68,882,600</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.3%</span></td>
              </tr>
              <tr key="IT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Italy</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">58,943,464</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-green-400">-0.0%</span></td>
              </tr>
              <tr key="ES" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Spain</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">49,128,297</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.0%</span></td>
              </tr>
              <tr key="PL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Poland</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">36,497,495</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-green-400">-0.3%</span></td>
              </tr>
              <tr key="RO" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Romania</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">19,043,151</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-green-400">-0.1%</span></td>
              </tr>
              <tr key="NL" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Netherlands</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">18,044,027</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.6%</span></td>
              </tr>
              <tr key="BE" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Belgium</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">11,883,495</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.6%</span></td>
              </tr>
              <tr key="CZ" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Czechia</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">10,909,500</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+0.1%</span></td>
              </tr>
              <tr key="PT" className="border-b border-[#2A2D3A]/50">
                <td className="py-2 pr-4 text-sm text-white">Portugal</td>
                <td className="py-2 text-right font-mono text-sm text-[#4DD0E1]">10,749,635</td>
                <td className="py-2 pl-4 text-right font-mono text-xs"><span className="text-yellow-300">+1.0%</span></td>
              </tr>
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-lg border border-[#4DD0E1]/20 bg-[#4DD0E1]/5 p-8 text-center">
        <h2 className="text-lg font-light text-white">Get this data via API</h2>
        <p className="mt-2 text-sm text-[#8890AA]">All numbers in this report come from EurostatAPI. Free tier: 100 req/day.</p>
        <a href="https://console.aethar.dev" className="mt-4 inline-block rounded bg-[#4DD0E1] px-6 py-2.5 text-sm font-semibold text-[#0F1117]">Get Free API Key</a>
      </div>

      <p className="mt-8 text-[10px] text-[#8890AA]">Data sourced from Eurostat via Aethar EurostatAPI. Auto-generated report.</p>
    </div>
  );
}
