/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Redirection vers le service d'authentification
      {
        source: '/api/auth/:path*',
        destination: `${process.env.AUTH_SERVICE_URL}/api/auth/:path*`,
      },
      // Redirection vers le service de catalogue
      {
        source: '/api/products/:path*',
        destination: `${process.env.CATALOG_SERVICE_URL}/api/products/:path*`,
      },
      // Redirection vers le service de commandes
      {
        source: '/api/orders/:path*',
        destination: `${process.env.ORDER_SERVICE_URL}/api/orders/:path*`,
      },
      // Redirection vers le dashboard admin (Angular)
      {
        source: '/admin/:path*',
        destination: `${process.env.ADMIN_DASHBOARD_URL}/admin/:path*`,
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
