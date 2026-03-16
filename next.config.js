/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;
