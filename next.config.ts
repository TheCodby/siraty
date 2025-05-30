import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    // Enable experimental features if needed
  },
  // Add any other configuration options here
};

export default withNextIntl(nextConfig);
