import Link from "next/link";
import { Solitreo } from "next/font/google";
import { redirect } from "next/navigation";
import "./globals.css";

const solitreo = Solitreo({
  subsets: ["latin"],
  weight: "400",
});

export default async function Home({
  searchParams,
}: {
  searchParams?: { dev?: string } | Promise<{ dev?: string }>;
}) {
  return (
    <main className="page-enter">
      <section className="hero">
        <div className="container">
          <div className="hero-stack" style={{ minHeight: "360px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="hero-copy" style={{ transform: "none", textAlign: "center", alignItems: "center" }}>
              <h1 className="animate-fade-up" style={{ animationDelay: "80ms" }}>
                <span className={solitreo.className} style={{ fontSize: "55px" }}>
                  mira
                </span>{" "}
                Puzzles
              </h1>
              <p className="muted-note animate-fade-up" style={{ animationDelay: "180ms" }}>
                Test your wit with mind-bending puzzles
              </p>
              <div className="cta-row animate-fade-up" style={{ animationDelay: "280ms" }}>
                <Link href="/puzzle-abc" className="btn btn-primary">
                  Begin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
