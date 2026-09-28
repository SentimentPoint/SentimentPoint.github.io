import type { NextConfig } from "next";

/** Fully static output for GitHub Pages: builds to ./out, no server needed. */
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
