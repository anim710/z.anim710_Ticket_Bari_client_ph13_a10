/** @type {import('next').NextConfig} */
const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  // Proxy Better Auth through the Next origin so OAuth cookies are same-site
  // (fixes Vercel ↔ Render state_security_mismatch).
  async rewrites() {
    return [
      {
        source: "/api/auth/better/:path*",
        destination: `${apiOrigin}/api/auth/better/:path*`,
      },
    ];
  },
};

export default nextConfig;
