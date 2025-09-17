/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: 'custom', // Usamos un loader personalizado
    domains: ['storage.encantia.online'], // Tu dominio personalizado
  },
};

export default nextConfig;
