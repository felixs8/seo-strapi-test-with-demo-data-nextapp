// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "great-bell-11555cb751.media.strapiapp.com",
      },
    ],
  },
};

module.exports = nextConfig;
