/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ravdcnteubpeotmrmfgi.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
