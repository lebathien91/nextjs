/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"],
    loader: "default",
  },
  i18n: {
    locales: ["en", "vi"],
    defaultLocale: "vi",
  },
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = nextConfig;
