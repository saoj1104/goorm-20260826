import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: 'export',
      basePath: '/goorm-20260826',
      assetPrefix: '/goorm-20260826/',
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
