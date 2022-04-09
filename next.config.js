/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ 'res.cloudinary.com' ],
  },
  rewrites() {
    return {
        beforeFiles: [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'dashboard.romdig.net',
                    },
                ],
                destination: '/404',
            },
        ]
    }
}
}

module.exports = nextConfig
