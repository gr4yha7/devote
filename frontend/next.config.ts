import type { NextConfig } from "next";
import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs";
const withCivicAuth = createCivicAuthPlugin({
  // eslint-disable-next-line no-undef
  clientId: process.env.NEXT_PUBLIC_CIVIC_AUTH_CLIENT_ID || "civic_..",
  // eslint-disable-next-line no-undef
  // oauthServer: process.env.AUTH_SERVER,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};
export default withCivicAuth(nextConfig);
// export default nextConfig;
