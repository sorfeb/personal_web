/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  /*
   * Keep the database driver out of the webpack bundle.
   *
   * Bundling a driver breaks the guarded requires they use to probe for optional
   * native accelerators. Webpack resolves a require it cannot find to an empty
   * module rather than letting it throw, so the `catch` that installs the pure-JS
   * fallback never runs. That is what took every database read down in SOR-163,
   * via `ws`.
   *
   * `pg` is already in Next's own default serverExternalPackages list, so this
   * line is belt and braces rather than the thing holding it up. It is named
   * anyway: the guarantee is load-bearing, and a default is a weaker promise than
   * a declaration. `@prisma/adapter-pg` is not in that default list.
   */
  serverExternalPackages: ['pg', '@prisma/adapter-pg'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'leetcard.jacoblin.cool',
      },
      {
        protocol: 'https',
        hostname: 'www.sorosfebria.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn-images-1.medium.com',
      },
      {
        protocol: 'https',
        hostname: 'img.shields.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 40, 48, 64, 96, 128, 256],
  },
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
