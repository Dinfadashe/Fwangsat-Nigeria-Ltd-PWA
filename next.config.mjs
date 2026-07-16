/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "60mb",
    },
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable webpack's persistent filesystem cache in development.
      // This environment has been hitting intermittent ENOENT errors when
      // webpack tries to rename its cache pack files, which was corrupting
      // the dev build and producing bogus "Unexpected token" errors that
      // had nothing to do with the actual source code.
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;