/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  /*
   * Keep the Neon driver chain out of the webpack bundle.
   *
   * `ws` probes for its optional native accelerator with a guarded require:
   *
   *   try {
   *     const bufferUtil = require('bufferutil');
   *     module.exports.mask = (...) => length < 48 ? _mask(...) : bufferUtil.mask(...);
   *   } catch { }   // fall back to the pure-JS mask
   *
   * `bufferutil` is not installed, so in plain Node the require throws, the catch
   * fires, and the pure-JS mask stands. Webpack resolves the same require to an
   * empty module instead of throwing, so the catch never runs and `mask` is
   * replaced by a wrapper closing over `{}`. Frames under 48 bytes still take the
   * JS path, which is why a connection opens fine and only fails later: the first
   * frame at or above 48 bytes throws `bufferUtil.mask is not a function` from a
   * timer callback, where nothing can reject the in-flight query. The request then
   * hangs until Vercel's 10s ceiling and returns FUNCTION_INVOCATION_TIMEOUT.
   *
   * Marking these external makes them real runtime requires, which restores the
   * try/catch. Externalising the whole chain rather than `ws` alone keeps any
   * other guarded optional require in the driver working the same way.
   */
  serverExternalPackages: ['ws', '@neondatabase/serverless', '@prisma/adapter-neon'],
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
