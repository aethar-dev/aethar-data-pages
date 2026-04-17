import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "EU Economic Data — Aethar",
  description:
    "Live EU economic statistics: GDP, inflation, unemployment, population, trade data for all European countries. Powered by Aethar APIs.",
  verification: {
    google: "drTZ1LfndZigmDPLKG9lRe-6tNeg0kgGFLjNczjXtdk",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <div className="adp-shell">
          <nav className="adp-nav">
            <div className="adp-nav-inner">
              <a href="/" className="adp-brand">
                <span className="adp-brand-dot" aria-hidden="true" />
                AETHAR DATA
              </a>
              <div className="adp-nav-links">
                <a href="/gdp" className="adp-nav-link">GDP</a>
                <a href="/inflation" className="adp-nav-link">Inflation</a>
                <a href="/unemployment" className="adp-nav-link">Unemployment</a>
                <a href="/population" className="adp-nav-link">Population</a>
                <a href="/compare" className="adp-nav-link">Compare</a>
                <a href="/errors" className="adp-nav-link">Errors</a>
                <a href="/reports/eu-snapshot-april-2026" className="adp-nav-link">Reports</a>
                <a href="https://console.aethar.dev" className="adp-nav-cta">
                  Get API Key
                </a>
              </div>
            </div>
          </nav>
          <main className="adp-main">{children}</main>
          <footer className="adp-footer">
            <p>
              Data sourced from Eurostat. Powered by{" "}
              <a href="https://aethar.dev">Aethar APIs</a>.
            </p>
            <p style={{ marginTop: 4 }}>
              Updated daily. Free API access at{" "}
              <a href="https://console.aethar.dev">console.aethar.dev</a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
