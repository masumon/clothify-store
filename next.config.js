/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const requiredServerEnv = ["ADMIN_USERNAME", "ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"];
const missingServerEnv = requiredServerEnv.filter((name) => !process.env[name]?.trim());

if (process.env.NODE_ENV !== "test" && missingServerEnv.length > 0) {
  throw new Error(
    `Missing required server environment variables: ${missingServerEnv.join(", ")}`
  );
}

const remotePatterns = [];
const connectSrc = new Set(["'self'"]);
const imgSrc = new Set(["'self'", "data:", "blob:"]);
const frameSrc = new Set(["'self'"]);

function addUrlHost(value, targetSet, protocols = ["https:"]) {
  if (!value) return;
  try {
    const parsed = new URL(value);
    if (!protocols.includes(parsed.protocol)) {
      targetSet.add(value);
      return;
    }
    targetSet.add(`${parsed.protocol}//${parsed.hostname}`);
  } catch {
    // Ignore invalid URLs and keep restrictive defaults.
  }
}

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const parsed = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    remotePatterns.push({
      protocol: parsed.protocol.replace(":", ""),
      hostname: parsed.hostname,
    });
    connectSrc.add(`${parsed.protocol}//${parsed.hostname}`);
    imgSrc.add(`${parsed.protocol}//${parsed.hostname}`);
  } catch {
    // Ignore invalid URL and keep restrictive default.
  }
}

addUrlHost(process.env.NEXT_PUBLIC_SITE_URL, connectSrc);
addUrlHost(process.env.SENTRY_DSN, connectSrc);
addUrlHost(process.env.NEXT_PUBLIC_SENTRY_DSN, connectSrc);
frameSrc.add("https://www.google.com");
frameSrc.add("https://maps.google.com");
frameSrc.add("https://www.google.com.bd");

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  `img-src ${Array.from(imgSrc).join(" ")}`,
  `connect-src ${Array.from(connectSrc).join(" ")}`,
  `frame-src ${Array.from(frameSrc).join(" ")}`,
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig = {
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
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
