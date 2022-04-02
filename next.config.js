/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ 'res.cloudinary.com' ],
  },
  env: {
    GOOGLE_API_KEY: 'AIzaSyCAV6pqgNM09d_ZQNJeSE9gL4OlT55n32Q'
  }
}

module.exports = nextConfig
