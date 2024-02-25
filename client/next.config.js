/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY
  },
};

module.exports = nextConfig;
