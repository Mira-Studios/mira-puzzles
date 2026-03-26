"use client";

import { useEffect, useState } from "react";
import { sha256Keyed } from "../puzzle.tsx";

export default function KeyedHashGenPage() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!input) {
        setHash("");
        setError(null);
        return;
      }

      try {
        setBusy(true);
        const next = await sha256Keyed(input);
        if (!cancelled) {
          setHash(next);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setHash("");
          setError(e instanceof Error ? e.message : "Failed to hash input.");
        }
      } finally {
        if (!cancelled) {
          setBusy(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <main style={{ padding: "48px 20px", maxWidth: "760px", margin: "0 auto", color: "#111" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "8px", color: "#0b0b0b" }}>
        Keyed SHA-256 Generator
      </h1>
      <p style={{ color: "#1f2937", marginBottom: "24px" }}>
        Enter any text below to generate a keyed SHA-256 hash using your current key.
      </p>

      <label htmlFor="keyed-hash-input" style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>
        Input
      </label>
      <textarea
        id="keyed-hash-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={5}
        placeholder="Type or paste text to hash"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #0f172a",
          background: "#ffffff",
          color: "#0b0b0b",
          fontFamily: "inherit",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />

      <div style={{ marginBottom: "12px", fontWeight: 600, color: "#0b0b0b" }}>Output</div>
      <div
        style={{
          minHeight: "56px",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #0f172a",
          background: "#f8fafc",
          color: "#0b0b0b",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          wordBreak: "break-all",
        }}
      >
        {busy && !hash && !error ? "Hashing..." : null}
        {!busy && !hash && !error ? "" : null}
        {hash}
        {error ? `Error: ${error}` : null}
      </div>
    </main>
  );
}
