/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '*.tiktokcdn.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: '*.tiktokcdn-us.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
}

module.exports = nextConfig
