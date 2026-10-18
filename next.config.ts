import type { NextConfig } from 'next';

const config: NextConfig = {
  // Static export: `npm run build` writes a plain website to ./out that can be
  // opened from any static host or served locally with `npm start`.
  output: 'export',
  images: { unoptimized: true },
};

export default config;
