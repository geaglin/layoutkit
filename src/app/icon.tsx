import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0a0a0b",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 512 512">
          <path
            d="M72 88 L72 400 L224 400"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="52"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path d="M288 400 L288 88" fill="none" stroke="#22d3ee" strokeWidth="52" strokeLinecap="square" />
          <path
            d="M288 260 L420 88"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="52"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path
            d="M320 290 L420 400"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="52"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
