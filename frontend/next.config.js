/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'image.tmdb.org',
      'img.youtube.com',
      'm.media-amazon.com',
      'ih1.redbubble.net',
      'i.pinimg.com',
      '64.media.tumblr.com',
      'www.redwolf.in',
      'posterdrops-images.s3.amazonaws.com',
      'yvezrqitxosjfitjgzmz.supabase.co'
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = nextConfig
