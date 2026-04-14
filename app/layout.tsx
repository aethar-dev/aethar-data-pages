import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EU Economic Data — Aethar",
  description: "Live EU economic statistics: GDP, inflation, unemployment, population, trade data for all European countries. Powered by Aethar APIs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0F1117] text-[#E0E2EF] antialiased">
        <nav className="border-b border-[#2A2D3A] bg-[#0F1117]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <a href="/" className="font-semibold tracking-[4px] text-sm text-white">AETHAR DATA</a>
            <div className="flex items-center gap-6 text-xs text-[#8890AA]">
              <a href="/gdp" className="hover:text-white transition-colors">GDP</a>
              <a href="/inflation" className="hover:text-white transition-colors">Inflation</a>
              <a href="/unemployment" className="hover:text-white transition-colors">Unemployment</a>
              <a href="/population" className="hover:text-white transition-colors">Population</a>
              <a href="https://console.aethar.dev" className="rounded bg-[#4DD0E1] px-3 py-1.5 text-[#0F1117] font-semibold hover:bg-[#4DD0E1]/90 transition-colors">
                Get API Key
              </a>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        <footer className="border-t border-[#2A2D3A] py-8 text-center text-xs text-[#8890AA]">
          <p>Data sourced from Eurostat. Powered by <a href="https://aethar.dev" className="text-[#4DD0E1] hover:underline">Aethar APIs</a>.</p>
          <p className="mt-1">Updated daily. Free API access at <a href="https://console.aethar.dev" className="text-[#4DD0E1] hover:underline">console.aethar.dev</a></p>
        </footer>
      </body>
    </html>
  );
}
