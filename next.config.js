/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack(config) {
      // Grab the existing rule that handles SVG imports
      const fileLoaderRule = config.module.rules.find((rule) =>
        rule.test?.test?.(".svg"),
      );
  
      config.module.rules.push(
        // Reapply the existing rule, but only for svg imports ending in ?url
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
          use: ["@svgr/webpack"],
        },
      );
  
      // Modify the file loader rule to ignore *.svg, since we have it handled now.
      fileLoaderRule.exclude = /\.svg$/i;
  
      return config;
    },
    reactStrictMode: true,
    transpilePackages: ["ui", "icons"],
    swcMinify: true,
    images: {
      formats: ["image/avif", "image/webp"],
      unoptimized: true,
      remotePatterns: [],
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === "production",
    },
  };
  
  module.exports = nextConfig;
  