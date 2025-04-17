/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // Usar path.resolve para crear una ruta absoluta
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename]
      },
      cacheDirectory: path.resolve(__dirname, '.next/cache/webpack'),
      maxAge: 604800000 // 1 semana en milisegundos
    };
    return config;
  }
};

module.exports = nextConfig;