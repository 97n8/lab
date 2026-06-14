/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Temporary holding page: serve the static holding page at the root.
  // Remove this `rewrites` block to restore the full Next.js homepage.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/holding.html" }]
    };
  }
};

export default nextConfig;
