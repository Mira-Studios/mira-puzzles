import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mira Puzzles",
  description: "Puzzle games from Mira",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{const t=localStorage.getItem('theme-preference');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch{}",
          }}
        />
      </head>
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="container nav-wrap">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link href="/" className="brand" aria-label="Mira Puzzles home">
                  <Image
                    src="/assets/mira.png"
                    alt="Mira"
                    width={140}
                    height={38}
                    className="brand-image"
                    priority
                  />
                  <span className="brand-text">Puzzles</span>
                </Link>
              </div>
              <div className="nav-controls">
                <nav className="nav-links" aria-label="Primary">
                  <Link href="/">Home</Link>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {children}

          <footer className="site-footer">
            <div className="container nav-wrap footer-nav-wrap">
              <p className="footer-brand">Mira Puzzles - MIT License - &copy; {year}</p>
              <nav className="nav-links" aria-label="Footer">
                <Link href="/">Home</Link>
                <a href="https://github.com/FatalMistake02/mira-puzzles" target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a
                  href="https://github.com/FatalMistake02/mira-puzzles/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                >
                  License
                </a>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
