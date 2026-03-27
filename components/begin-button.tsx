"use client";

import { useState } from "react";

export function BeginButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className="btn btn-primary"
      disabled
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: "default",
        opacity: 0.7,
        transition: "opacity 0.3s ease",
      }}
    >
      <span
        style={{
          display: "inline-block",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          position: "absolute",
        }}
      >
        Begin
      </span>
      <span
        style={{
          display: "inline-block",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0)" : "translateY(4px)",
        }}
      >
        Under development
      </span>
    </button>
  );
}
