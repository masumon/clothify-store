/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const remotePatterns = [];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const parsed = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    remotePatterns.push({
      protocol: parsed.protocol.replace(":", ""),
      hostname: parsed.hostname,
    });
  } catch {
    // Ignore invalid URL and keep restrictive default.
  }
}

const nextConfig = {
  images: {
    remotePatterns,
  },
  webpack(config) {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /@opentelemetry\/instrumentation/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
      {
        module: /@fastify\/otel/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
      {
        module: /@prisma\/instrumentation/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    return config;
  },
};

module.exports = withPWA(nextConfig);
