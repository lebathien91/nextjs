/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"],
    loader: "default",
  },
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = nextConfig;
